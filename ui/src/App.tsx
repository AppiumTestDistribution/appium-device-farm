// import React from "react";
// import Header from "./components/header/header";
// import SessionList from "./components/UI/organisms/session-list";
// import SessionDetails from "./components/session-details/session-details";
// import "./App.css";
// import Spinner from "./widgets/spinner/spinner";
// import { Router, Route, Redirect } from "react-router-dom";
// import history from "./history";
// import CommonUtils from "./utils/common-utils";
// import SessionApi from "./api/sessions";

// class App extends React.Component<any, any> {
//   private polling: any;
//   constructor(props: any) {
//     super(props);
//     const sessionId = window.location.pathname.match(
//       new RegExp(/dashboard\/session\/(.*)/),
//     );
//     const filters = this.getFiltersFromQueryParams();
//     this.state = {
//       loading: true,
//       sessions: [],
//       activeSession: sessionId && sessionId.length ? sessionId[1] : null,
//       filterText: "",
//       sessionListFilters: Object.assign({}, filters),
//     };
//   }

//   getFiltersFromQueryParams() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const filterObject = {} as any;
//     const allowedFilters: any = {
//       name: "",
//       os: {
//         valid: ["ios", "android"],
//       },
//       status: {
//         valid: ["running", "failed", "passed", "timeout"],
//       },
//       device_udid: "",
//       start_time: {
//         valid: (dateString: string) => {
//           return !isNaN(new Date(dateString).getDate());
//         },
//       },
//     };
//     //TODO: sudharsan - Improve filter parsing logic
//     Object.keys(allowedFilters).forEach((key) => {
//       if (urlParams.get(key)) {
//         if (!allowedFilters[key].valid) {
//           filterObject[key] = urlParams.get(key);
//         } else if (allowedFilters[key].valid) {
//           if (
//             typeof allowedFilters[key].valid === "function" &&
//             allowedFilters[key].valid(urlParams.get(key))
//           ) {
//             filterObject[key] = urlParams.get(key);
//           } else if (
//             Array.isArray(allowedFilters[key].valid) &&
//             allowedFilters[key].valid.indexOf(urlParams.get(key)) >= 0
//           ) {
//             filterObject[key] = urlParams.get(key);
//           }
//         }
//       }
//     });
//     return filterObject;
//   }

//   fetchSessions() {
//     SessionApi.getAllSessions(this.state.sessionListFilters).then(
//       (result) => {
//         const filteredRows = CommonUtils.filterSessionList(
//           result.result.rows,
//           this.state.sessionListFilters,
//         );
//         this.setState({
//           loading: false,
//           sessions: result.result.rows,
//           activeSession:
//             filteredRows.filter(
//               (r: any) => r.session_id == this.state.activeSession,
//             ).length > 0
//               ? this.state.activeSession
//               : filteredRows[0]?.session_id,
//         });
//       },
//       () => {
//         this.setState({
//           loading: false,
//           sessions: [],
//         });
//       },
//     );
//   }

//   componentDidMount() {
//     this.initSessionPolling();
//   }

//   componentWillUnmount() {
//     this.resetPolling();
//   }

//   initSessionPolling() {
//     this.resetPolling();
//     this.fetchSessions();
//     this.polling = setInterval(this.fetchSessions.bind(this), 8000);
//   }

//   resetPolling() {
//     this.polling && clearInterval(this.polling);
//     this.polling = null;
//   }

//   onSessionCardClicked(sessionId: string) {
//     if (sessionId != this.state.activeSession) {
//       this.initSessionPolling();
//       this.setState({ activeSession: sessionId });
//     }
//   }

//   onSessionFilterChanged(filterText: string) {
//     this.setState({ filterText });
//   }

//   getSessions() {
//     if (this.state.filterText) {
//       return this.state.sessions.filter(
//         (s: any) => s.session_id.indexOf(this.state.filterText) >= 0,
//       );
//     } else {
//       return this.state.sessions;
//     }
//   }

//   getFilteredSessions() {
//     return CommonUtils.filterSessionList(
//       this.getSessions(),
//       this.state.sessionListFilters,
//     );
//   }

//   onFilterApplied(filters: any) {
//     console.log(filters);
//     this.setState({ sessionListFilters: filters });
//   }

//   getMainContent() {
//     if (this.state.loading) {
//       return (
//         <div className="app__loading">
//           <Spinner />
//           <div className="app__loading_message code">
//             Loading... Please wait
//           </div>
//         </div>
//       );
//     } else if (this.state.sessions.length <= 0) {
//       return (
//         <div className="app__loading">
//           <Spinner />
//           <div className="app__loading_message code">
//             Waiting for new session to start
//           </div>
//         </div>
//       );
//     } else {
//       return (
//         <div className="app__main_content code">
//           <Router history={history}>
//             <SessionList
//               sessions={this.getFilteredSessions()}
//               activeSession={this.state.activeSession}
//               onSessionCardClicked={this.onSessionCardClicked.bind(this)}
//               isFilterApplied={this.state.filterText.length > 0}
//               filters={this.state.sessionListFilters}
//               onFilterApplied={this.onFilterApplied.bind(this)}
//             />
//             <Route
//               path="/dashboard/session/:sessionId"
//               render={(props: any) => (
//                 <SessionDetails
//                   session={
//                     this.state.sessions.filter(
//                       (s: any) => s.session_id == props.match.params.sessionId,
//                     )[0]
//                   }
//                 />
//               )}
//             />
//             {this.getFilteredSessions().length == 0 && (
//               <Redirect to={`/dashboard/${window.location.search}`} />
//             )}
//             {this.state.activeSession && (
//               <Redirect
//                 to={`/dashboard/session/${this.state.activeSession}${window.location.search}`}
//               />
//             )}
//           </Router>
//         </div>
//       );
//     }
//   }

//   render() {
//     return (
//       <div className="app__container">
//         <div className="app__wrapper">
//           <Header
//             onSessionFilterChanged={this.onSessionFilterChanged.bind(this)}
//           />
//           {this.getMainContent()}
//         </div>
//       </div>
//     );
//   }
// }

// export default App;

export {};
