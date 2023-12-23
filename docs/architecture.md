# Appium Device Farm Architecture
Here are some diagram to illustrate how the plugin works.

## Device Inventory
### Device Added
When the device trackers see new device.
```mermaid
  sequenceDiagram
    Device Manager (inside node)->>Node Plugin: new device detected!
    Node Plugin->>Node Plugin: Great! Adding it to my database
    Node Plugin->>Hub: Hey, I have new device you can use!
    Hub--)Node Plugin: (Whisper) Thanks.
```

### Device Removed
When the device trackers see missing device.
```mermaid
  sequenceDiagram
    Device Manager (inside node)->>Node Plugin: oops, this device is no longer detected.
    Node Plugin->>Node Plugin: Ouch! Updating my database
    Node Plugin->>Hub: Hey, I no longer have this device!
    Hub--)Node Plugin: (Whisper) Thanks.
```

## Session Request
The following diagrams illustrate how session is created.
### Device is on the hub
When target device is hosted on the hub.
```mermaid
  sequenceDiagram
    User ->> Hub: I want to have a session with this capability
    Hub -->> User: Please wait, let me allocate it for you.
    Hub -->> Device Manager (hub): Get me a device matching this capability please.
    Device Manager (hub) -->> Hub: Lucky you, I have it in this hub server itself. There you go.
    Hub ->> User: Here's your session.
```

### Device is on the node
When target device is hosted on the node.
```mermaid
  sequenceDiagram
    User ->> Hub: I want to have a session with this capability
    Hub -->> User: Please wait, let me allocate it for you.
    Hub -->> Device Manager (hub): Get me a device matching this capability please.
    Device Manager (hub)-->> Hub: The device is available but it's not on this hub server. Let me forward your request to the device owner.
    Device Manager (hub) -->> Node: Hey, please allocate this device for me.
    Node -->> Device Manager (hub): Sure thing. Here, you go.
    Device Manager (hub) -->> Hub: It's ready now. Here's your session.
    Hub ->> User: I had to forward your request. But, here's your session.
```

## Device Allocation
When a session is to be created, the plugin will block the device on the hub. This will prevent subsequent request from getting the same device. Once device is blocked, hub will create a session using aforementioned device. 

When the device is hosted on a node (not the hub), session request will be forwarded. The plugin in the node will receive the session request and apply the same logic as the above.

When a device is getting allocated for a session, the device will be blocked (marked as `busy`).

## Forwarded Session
When session is allocated in the node, the hub will act as a gateway. It's keeping the record of session id and which node is serving this particular session.

```mermaid
flowchart TD
    user["test automation"]
    hub
    plugin{is the session forwarded?}
    node-appium
    hub-appium

    user -->|appium command| hub
    hub --> plugin
    plugin -->|Yes| node-appium
    plugin -->|No| hub-appium
    node-appium --> End
    hub-appium --> End

```

