# Device Lab System - Architecture Diagram

## System Overview

This document describes the architecture of an advanced device lab system that enables remote access and automation testing of mobile devices from anywhere in the world.

## Component Diagram

```mermaid
graph TB
    subgraph "External Services"
        DB[(PostgreSQL<br/>Database)]
        REDIS[(Redis<br/>Cache)]
        COTURN[Coturn Server<br/>WebRTC Routing]
    end

    subgraph "Hub Cluster"
        HUB1[Hub Server 1<br/>HTTP Server<br/>Socket.IO Server]
        HUB2[Hub Server N<br/>HTTP Server<br/>Socket.IO Server]
        HUB1 -.->|Scale via Redis| REDIS
        HUB2 -.->|Scale via Redis| REDIS
        HUB1 -->|Connection| DB
        HUB2 -->|Connection| DB
        HUB1 -->|WebRTC Signaling| COTURN
        HUB2 -->|WebRTC Signaling| COTURN
    end

    subgraph "Node Agents"
        NODE1[Node Agent 1<br/>Device Manager<br/>WebSocket Client]
        NODE2[Node Agent 2<br/>Device Manager<br/>WebSocket Client]
        NODEN[Node Agent N<br/>Device Manager<br/>WebSocket Client]

        DEVICE1[Mobile Device 1]
        DEVICE2[Mobile Device 2]
        DEVICEN[Mobile Device N]

        NODE1 -->|Controls| DEVICE1
        NODE2 -->|Controls| DEVICE2
        NODEN -->|Controls| DEVICEN
    end

    subgraph "Clients"
        BROWSER[Web Browser<br/>Manual Testing]
        APPIUM[Appium Client<br/>Automation Testing]
    end

    NODE1 <-->|WebSocket + HTTP| HUB1
    NODE2 <-->|WebSocket + HTTP| HUB2
    NODEN <-->|WebSocket + HTTP| HUB1

    BROWSER <-->|HTTP/WebSocket<br/>WebRTC| HUB1
    APPIUM <-->|HTTP<br/>WebDriver Protocol| HUB1

    style HUB1 fill:#4CAF50
    style HUB2 fill:#4CAF50
    style NODE1 fill:#2196F3
    style NODE2 fill:#2196F3
    style NODEN fill:#2196F3
    style DB fill:#FF9800
    style REDIS fill:#F44336
    style COTURN fill:#9C27B0
```

## Hub Startup Sequence

```mermaid
sequenceDiagram
    participant User
    participant Hub
    participant DB as PostgreSQL
    participant Redis
    participant Coturn
    participant HTTP as HTTP Server
    participant SocketIO as Socket.IO Server

    User->>Hub: Start Hub Server
    Hub->>DB: Connect to Database
    DB-->>Hub: Connection Established
    Hub->>Coturn: Connect to Coturn Server
    Coturn-->>Hub: Connection Established
    Hub->>Redis: Connect to Redis Cache
    Redis-->>Hub: Connection Established
    Hub->>HTTP: Start HTTP Server
    HTTP-->>Hub: Server Ready
    Hub->>SocketIO: Start Socket.IO Server<br/>(with Redis adapter)
    SocketIO-->>Hub: Server Ready
    Hub-->>User: Hub Server Started Successfully
```

## Node Registration Flow

```mermaid
sequenceDiagram
    participant Node
    participant Hub
    participant DB as PostgreSQL

    Node->>Hub: WebSocket Connection Request<br/>(with Authentication Token)
    Hub->>Hub: Validate Authentication Token
    alt Authentication Successful
        Hub-->>Node: WebSocket Connection Established
        Node->>Hub: HTTP POST /api/devices<br/>(Device Information)
        Hub->>DB: Store Device Information
        DB-->>Hub: Device Registered
        Hub-->>Node: 200 OK (Device Registered)
        Note over Node,Hub: WebSocket kept open for<br/>Hub-to-Node communication
    else Authentication Failed
        Hub-->>Node: Connection Rejected (401)
    end
```

## Manual Device Control Flow

```mermaid
sequenceDiagram
    participant Browser
    participant Hub
    participant Node
    participant Device
    participant Coturn
    participant DB as PostgreSQL

    Browser->>Hub: HTTP Request: Control Device
    Hub->>DB: Check Device Availability
    DB-->>Hub: Device Available
    Hub->>DB: Block Device (Mark as Busy)
    Hub->>Node: WebSocket: Create Session<br/>(Tracking ID)
    Node->>Device: Initialize Device Session
    alt Session Creation Success
        Node->>Hub: HTTP POST /api/sessions<br/>(Tracking ID, Session Info)
        Hub->>Browser: Request ICE Configuration
        Browser-->>Hub: Browser ICE Candidates
        Hub->>Node: WebSocket: Request ICE Configuration
        Node-->>Hub: Node ICE Candidates
        Hub->>Coturn: Configure WebRTC Signaling
        Hub->>Browser: Node ICE Candidates
        Hub->>Node: Browser ICE Candidates
        Note over Browser,Node: WebRTC Peer Connection<br/>(via Coturn)
        Browser->>Node: WebRTC Stream (Video/Audio)
        Node->>Browser: WebRTC Stream (Video/Audio)
        Note over Browser,Device: Real-time Streaming & Control
        Browser->>Hub: End Session
        Hub->>Node: WebSocket: End Session
        Node->>Device: Release Device
        Node->>Hub: HTTP POST: Session Ended
        Hub->>DB: Unblock Device
    else Session Creation Failed
        Node->>Hub: HTTP POST /api/sessions/error<br/>(Tracking ID, Error Logs)
        Hub->>DB: Unblock Device
        Hub-->>Browser: Error Response (with Logs)
    end
```

## Automation Testing Flow

```mermaid
sequenceDiagram
    participant AppiumClient
    participant Hub
    participant Node
    participant Device
    participant DB as PostgreSQL
    participant FileSystem

    AppiumClient->>Hub: POST /wd/hub/session<br/>(WebDriver Capabilities)
    Hub->>DB: Find Available Device & Node
    DB-->>Hub: Device & Node Information
    Hub->>DB: Block Device (Mark as Busy)
    Hub->>Node: WebSocket: Create Session<br/>(Tracking ID, Capabilities)
    Node->>Device: Initialize Appium Session
    alt Session Creation Success
        Node->>Hub: HTTP POST /api/sessions<br/>(Tracking ID, Session Info)
        Hub-->>AppiumClient: 200 OK (Session Created)<br/>(Session ID, Capabilities)

        loop WebDriver Commands
            AppiumClient->>Hub: HTTP Request<br/>(WebDriver Command)
            Hub->>Node: WebSocket: Relay Command<br/>(Session ID, Command)
            Node->>Device: Execute Command
            Device-->>Node: Command Response
            Node->>Hub: WebSocket: Command Response
            Hub-->>AppiumClient: HTTP Response
        end

        AppiumClient->>Hub: DELETE /wd/hub/session/:id
        Hub->>Node: WebSocket: End Session
        Node->>Device: End Session & Collect Data
        Node->>Hub: HTTP POST /api/sessions/logs<br/>(Session Logs, Device Logs,<br/>Screenshots, Videos)
        Hub->>FileSystem: Store Session Data
        Hub->>DB: Unblock Device
        Hub-->>AppiumClient: 200 OK (Session Deleted)
    else Session Creation Failed
        Node->>Hub: HTTP POST /api/sessions/error<br/>(Tracking ID, Error Logs)
        Hub->>DB: Unblock Device
        Hub-->>AppiumClient: 500 Error (with Logs)
    end
```

## Data Flow Diagram

```mermaid
flowchart LR
    subgraph "Request Types"
        A[Manual Control Request]
        B[Automation Request]
    end

    subgraph "Hub Processing"
        C{Check Device<br/>Availability}
        D[Block Device]
        E[Find Node]
        F[Send WebSocket Message]
    end

    subgraph "Node Processing"
        G[Create Session]
        H[Execute Commands]
        I[Collect Logs/Media]
    end

    subgraph "Communication Channels"
        J[WebSocket<br/>Hub → Node]
        K[HTTP<br/>Node → Hub]
        L[HTTP<br/>Client → Hub]
        M[WebRTC<br/>Browser ↔ Node]
    end

    subgraph "Storage"
        N[(PostgreSQL)]
        O[File System]
    end

    A --> C
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> O
    F --> J
    I --> K
    A --> L
    B --> L
    C --> N
    D --> N
    A --> M
```

## Key Architectural Decisions

### 1. Communication Patterns

- **Hub → Node**: WebSocket (for real-time commands and session management)
- **Node → Hub**: HTTP REST API (for device registration, session updates, logs)
- **Client → Hub**: HTTP REST API (for WebDriver protocol and device management)
- **Browser ↔ Node**: WebRTC (for real-time streaming via Coturn server)

### 2. Scalability

- Hub can be scaled horizontally using Redis adapter for Socket.IO
- Multiple Hub instances share session state via Redis
- PostgreSQL provides persistent storage for devices and sessions
- Each Node can manage multiple devices

### 3. Session Management

- Hub maintains device state (available/busy)
- Tracking IDs used to correlate WebSocket messages with HTTP responses
- Node is responsible for actual device interaction and session lifecycle
- Session data (logs, videos, screenshots) uploaded to Hub after session completion

### 4. Error Handling

- Failed session creation sends error logs back to client
- Device automatically unblocked on session failure
- All errors logged and tracked via Hub database

## Technology Stack

- **Hub**: Node.js/TypeScript with Express and Socket.IO
- **Node**: Node.js/TypeScript with WebSocket client
- **Database**: PostgreSQL (via Prisma ORM)
- **Cache**: Redis (Socket.IO adapter)
- **WebRTC**: Coturn server for STUN/TURN
- **Automation**: Appium/WebDriver protocol support
- **Real-time Streaming**: WebRTC for manual device control
