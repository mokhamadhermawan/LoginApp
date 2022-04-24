// URL mapping, from hash to a function that responds to that URL action
const router = {

  "/": () => showContent("content-home"),
  "/profile": () =>profile(),
   // requireAuth(() => showContent("content-profile"), "/profile"),
  "/login": () => login(),
  "/resendEmail": () => sendEmail()
};

//Declare helper functions

/**
 * Iterates over the elements matching 'selector' and passes them
 * to 'fn'
 * @param {*} selector The CSS selector to find
 * @param {*} fn The function to execute for every element
 */
const eachElement = (selector, fn) => {
  for (let e of document.querySelectorAll(selector)) {
    fn(e);
  }
};

/**
 * Tries to display a content panel that is referenced
 * by the specified route URL. These are matched using the
 * router, defined above.
 * @param {*} url The route URL
 */
const showContentFromUrl = (url) => {
  if (router[url]) {
    router[url]();
    return true;
  }

  return false;
};

/**
 * Returns true if `element` is a hyperlink that can be considered a link to another SPA route
 * @param {*} element The element to check
 */
const isRouteLink = (element) =>
  element.tagName === "A" && element.classList.contains("route-link");

/**
 * Displays a content panel specified by the given element id.
 * All the panels that participate in this flow should have the 'page' class applied,
 * so that it can be correctly hidden before the requested content is shown.
 * @param {*} id The id of the content to show
 */
const showContent = (id) => {
  eachElement(".page", (p) => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
};

/**
 * Updates the user interface
 */
const updateUI = async () => {
  try {
    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
      const user = await auth0.getUser();

      eachElement(".auth-invisible", (e) => e.classList.add("hidden"));
      eachElement(".auth-visible", (e) => e.classList.remove("hidden"));
      eachElement(".profile-image", (e) => (e.src = user.picture));
      eachElement(".user-name", (e) => (e.innerText = user.name));
      eachElement(".user-email", (e) => (e.innerText = user.email));
      if (user.email_verified ==false) {
        eachElement(".email_verify", (e) => e.classList.remove("hidden"));
        return;
      }
      // document.getElementById("profile-data").innerText = JSON.stringify(
      //   user,
      //   null,
      //   2
      // );
      // document.querySelectorAll("pre code").forEach(hljs.highlightBlock);

      
     
      eachElement(".gated-content", (e) => e.classList.remove("hidden"));
      eachElement(".user_list", (e) => e.classList.remove("hidden"));
    
      var settings = {
        "async": true,
        "crossDomain": true,
        url: 'https://dev-njs-7ndp.us.auth0.com/api/v2/users',
       // params: {q: 'email:"aa@exampleco.com"', search_engine: 'v3'},
        method: 'GET',
        // headers: {authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9ldWpsY1h6Y1NkUTcxU21nVnNjTyJ9.eyJpc3MiOiJodHRwczovL2Rldi1uanMtN25kcC51cy5hdXRoMC5jb20vIiwic3ViIjoiWnVXUEMwMVRQNWtTN1FvZld5RklFRDFpS3AzZ0hmcXVAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vZGV2LW5qcy03bmRwLnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjUwMDc1NjI3LCJleHAiOjE2NTAxNjIwMjcsImF6cCI6Ilp1V1BDMDFUUDVrUzdRb2ZXeUZJRUQxaUtwM2dIZnF1Iiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOmluc2lnaHRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6bG9nc191c2VycyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgdXBkYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgcmVhZDphbm9tYWx5X2Jsb2NrcyBkZWxldGU6YW5vbWFseV9ibG9ja3MgdXBkYXRlOnRyaWdnZXJzIHJlYWQ6dHJpZ2dlcnMgcmVhZDpncmFudHMgZGVsZXRlOmdyYW50cyByZWFkOmd1YXJkaWFuX2ZhY3RvcnMgdXBkYXRlOmd1YXJkaWFuX2ZhY3RvcnMgcmVhZDpndWFyZGlhbl9lbnJvbGxtZW50cyBkZWxldGU6Z3VhcmRpYW5fZW5yb2xsbWVudHMgY3JlYXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRfdGlja2V0cyByZWFkOnVzZXJfaWRwX3Rva2VucyBjcmVhdGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiBkZWxldGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiByZWFkOmN1c3RvbV9kb21haW5zIGRlbGV0ZTpjdXN0b21fZG9tYWlucyBjcmVhdGU6Y3VzdG9tX2RvbWFpbnMgdXBkYXRlOmN1c3RvbV9kb21haW5zIHJlYWQ6ZW1haWxfdGVtcGxhdGVzIGNyZWF0ZTplbWFpbF90ZW1wbGF0ZXMgdXBkYXRlOmVtYWlsX3RlbXBsYXRlcyByZWFkOm1mYV9wb2xpY2llcyB1cGRhdGU6bWZhX3BvbGljaWVzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIGRlbGV0ZTpyb2xlcyB1cGRhdGU6cm9sZXMgcmVhZDpwcm9tcHRzIHVwZGF0ZTpwcm9tcHRzIHJlYWQ6YnJhbmRpbmcgdXBkYXRlOmJyYW5kaW5nIGRlbGV0ZTpicmFuZGluZyByZWFkOmxvZ19zdHJlYW1zIGNyZWF0ZTpsb2dfc3RyZWFtcyBkZWxldGU6bG9nX3N0cmVhbXMgdXBkYXRlOmxvZ19zdHJlYW1zIGNyZWF0ZTpzaWduaW5nX2tleXMgcmVhZDpzaWduaW5nX2tleXMgdXBkYXRlOnNpZ25pbmdfa2V5cyByZWFkOmxpbWl0cyB1cGRhdGU6bGltaXRzIGNyZWF0ZTpyb2xlX21lbWJlcnMgcmVhZDpyb2xlX21lbWJlcnMgZGVsZXRlOnJvbGVfbWVtYmVycyByZWFkOmVudGl0bGVtZW50cyByZWFkOmF0dGFja19wcm90ZWN0aW9uIHVwZGF0ZTphdHRhY2tfcHJvdGVjdGlvbiByZWFkOm9yZ2FuaXphdGlvbnNfc3VtbWFyeSByZWFkOm9yZ2FuaXphdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIGNyZWF0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgcmVhZDpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBjcmVhdGU6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIHJlYWQ6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.ClMlcs-pnEgpIXEtF3G5st1-t_JuzawM2Eu_--SfahofmeUzCp56SzuC0RP8rGYcNvo3NJMMGKyovC8O0YnEOl-CZOziYlpI-gdqc4gM0sGM9NhJDbJ09BdqfVbOSC9EPzKDdJ668wI3V9iWtW2qhN5ig2xTzBbT2POKzbAeYjfmvNA2vAfslWYl0-FRJL1BuH2_lshFOGJJ66d54StIWp7MFIFnoz-V9wMFbUy2zo07wspF9RLk1M0lIWvWaoJ4ojgRWjgFr4Iducd-mc_STNxiHPPR1G2LKH8ckbBQEpbO9ENg4lQ-hxbKjRD_tV7PB6ViKGU64vZvZPDDzk8cqg'},
        //"content-type": 'application/json',
        "headers": {
          "authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9ldWpsY1h6Y1NkUTcxU21nVnNjTyJ9.eyJpc3MiOiJodHRwczovL2Rldi1uanMtN25kcC51cy5hdXRoMC5jb20vIiwic3ViIjoiWnVXUEMwMVRQNWtTN1FvZld5RklFRDFpS3AzZ0hmcXVAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vZGV2LW5qcy03bmRwLnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjUwNTMxMDM1LCJleHAiOjE2NTMxMjMwMzUsImF6cCI6Ilp1V1BDMDFUUDVrUzdRb2ZXeUZJRUQxaUtwM2dIZnF1Iiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOmluc2lnaHRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6bG9nc191c2VycyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgdXBkYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgcmVhZDphbm9tYWx5X2Jsb2NrcyBkZWxldGU6YW5vbWFseV9ibG9ja3MgdXBkYXRlOnRyaWdnZXJzIHJlYWQ6dHJpZ2dlcnMgcmVhZDpncmFudHMgZGVsZXRlOmdyYW50cyByZWFkOmd1YXJkaWFuX2ZhY3RvcnMgdXBkYXRlOmd1YXJkaWFuX2ZhY3RvcnMgcmVhZDpndWFyZGlhbl9lbnJvbGxtZW50cyBkZWxldGU6Z3VhcmRpYW5fZW5yb2xsbWVudHMgY3JlYXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRfdGlja2V0cyByZWFkOnVzZXJfaWRwX3Rva2VucyBjcmVhdGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiBkZWxldGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiByZWFkOmN1c3RvbV9kb21haW5zIGRlbGV0ZTpjdXN0b21fZG9tYWlucyBjcmVhdGU6Y3VzdG9tX2RvbWFpbnMgdXBkYXRlOmN1c3RvbV9kb21haW5zIHJlYWQ6ZW1haWxfdGVtcGxhdGVzIGNyZWF0ZTplbWFpbF90ZW1wbGF0ZXMgdXBkYXRlOmVtYWlsX3RlbXBsYXRlcyByZWFkOm1mYV9wb2xpY2llcyB1cGRhdGU6bWZhX3BvbGljaWVzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIGRlbGV0ZTpyb2xlcyB1cGRhdGU6cm9sZXMgcmVhZDpwcm9tcHRzIHVwZGF0ZTpwcm9tcHRzIHJlYWQ6YnJhbmRpbmcgdXBkYXRlOmJyYW5kaW5nIGRlbGV0ZTpicmFuZGluZyByZWFkOmxvZ19zdHJlYW1zIGNyZWF0ZTpsb2dfc3RyZWFtcyBkZWxldGU6bG9nX3N0cmVhbXMgdXBkYXRlOmxvZ19zdHJlYW1zIGNyZWF0ZTpzaWduaW5nX2tleXMgcmVhZDpzaWduaW5nX2tleXMgdXBkYXRlOnNpZ25pbmdfa2V5cyByZWFkOmxpbWl0cyB1cGRhdGU6bGltaXRzIGNyZWF0ZTpyb2xlX21lbWJlcnMgcmVhZDpyb2xlX21lbWJlcnMgZGVsZXRlOnJvbGVfbWVtYmVycyByZWFkOmVudGl0bGVtZW50cyByZWFkOmF0dGFja19wcm90ZWN0aW9uIHVwZGF0ZTphdHRhY2tfcHJvdGVjdGlvbiByZWFkOm9yZ2FuaXphdGlvbnNfc3VtbWFyeSByZWFkOm9yZ2FuaXphdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIGNyZWF0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgcmVhZDpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBjcmVhdGU6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIHJlYWQ6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.PCvb5i958DwWeTSCqyb9D8_hPNG6NpI81v4PaaHDK2uPF1Kr4181_-s1ATtxNKXuocUQddJefPPctwtMfUgoRRFIry8EAk9CCs0dQ7Dn585MBKTktzRChKIoEy9aY0-2LR0uf3Z--L0ogu8ay0HWKBfrPKACQ_iWGLG6_y4kEBdyoUG1yUSvsPql2odKiPD-CL6Wuk7OnLywG0R_75RlXR3wEXpO2U0x4rJQxk42CgXiddPCmzCXSBuA6wBkm5AWTYith0vHtxONIhnyYl_jftE7UL9si3kpX-4XPfy4J0yE9NYnhU1xo9KlvrJS-EEx8OiWMhYC1eBBB3JE-qkakw"
        },
        //body:'{"client_id":"YxAywWXnpp73RYyhGrZyQ8lYMQAxMcQm","client_secret":"Ed1SnE9_tqhLQvkKQnlwWO-8vxDugy9bITXDQmO4TjuUvq4-2J6Tuy1cOltCWBEN","audience":"https://dev-njs-7ndp.us.auth0.com/api/v2/","grant_type":"client_credentials"}' 

      //  "data": "{\"client_id\":\"YxAywWXnpp73RYyhGrZyQ8lYMQAxMcQm\",\"client_secret\":\"Ed1SnE9_tqhLQvkKQnlwWO-8vxDugy9bITXDQmO4TjuUvq4-2J6Tuy1cOltCWBEN\",\"audience\":\"https://dev-njs-7ndp.us.auth0.com/api/v2/\",\"grant_type\":\"client_credentials\"}"
      }
     
      $.ajax(settings).done(function (response) {
        let datalength=response.length;
        result=
        '<div> <b>Statistics :</b> </div>'+
        '<div >'+
        '<div>User sign Up='+datalength+' </div>'+
        '<div id="active_today">0</div>'+
        '<div id="active_7day">0</div>'+
        '</div>'+
        '<br><br> <div><b>User Dashborad</b></div>'+
                ' <div class="row'+
                '<div class="col-md-3">'+
                 '<input type="text" value="Name" disabled="true"/>'+
                 '<input type="text" value="Sign Up Date" disabled="true"/>'+
                 '<input type="text" value="Number Of Login" disabled="true"/>'+
                 '<input type="text" value="Last Login" disabled="true"/>'+
                 '</div>'+
              '</div>';
        var active_today=0;
        var active_7day=0;
        for(let i=0;i<datalength;i++){
          const dateStr =response[i].created_at;
          const date = new Date(dateStr);
          const create_date_timestamp = date.getTime();

          const datelast_loginStr =response[i].last_login;
          const datelast_login = new Date(dateStr);
          const last_login_timestamp = datelast_login.getTime();

          var today = new Date();
          var dd = String(today.getDate()).padStart(2, '0');
          var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = today.getFullYear();
          today = mm + '/' + dd + '/' + yyyy;

          var login=new Date(response[i].last_login);
          var dd_login = String(login.getDate()).padStart(2, '0');
          var mm_login = String(login.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy_login = login.getFullYear();
          login = mm_login + '/' + dd_login + '/' + yyyy_login;
          
          if(today==login){
            active_today++;
          }

          var last7day=new Date();
          last7day.setDate(last7day.getDate() - 6);
          var dd7 = String(last7day.getDate()).padStart(2, '0');
          var mm7 = String(last7day.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy7 = last7day.getFullYear();
          last7day = mm7 + '/' + dd7 + '/' + yyyy7;

          for(var arr=[],dt=new Date(last7day); dt<=new Date(today); dt.setDate(dt.getDate()+1)){
                arr.push(new Date(dt));
          }

           let data_length=arr.length;
           for(let i=0;i<data_length;i++){
                var dd_arr = String(arr[i].getDate()).padStart(2, '0');
                var mm_arr = String(arr[i].getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy_arr =arr[i].getFullYear();
                var day_login_7= mm_login + '/' + dd_login + '/' + yyyy_login;

                if(day_login_7==login){
                    active_7day++;
                }
           }
      


          result +=
          ' <div class="row'+
              '<div class="col-md-3">'+
                '<input type="text" class="user_name" value="'+response[i].name+'" disabled="true"></input>'+
                '<input type="text" class="created_at" value="'+create_date_timestamp+'" disabled="true"></input>'+
                '<input type="text" class="logins_count" value="'+response[i].logins_count+'" disabled="true"></input>'+
                '<input type="text" class="last_login" value="'+last_login_timestamp+'" disabled="true"></input>'+
              '</div>'+
            '</div>';
        }
        
        $('div#user_list').append(result);
         document.getElementById("active_today").innerText=' Active today= ' +active_today;
         document.getElementById("active_7day").innerText='Avg Number Session Last 7 day= ' +active_7day/7;
        console.log(response);
      });
     
    } else {
      eachElement(".auth-invisible", (e) => e.classList.remove("hidden"));
      eachElement(".auth-visible", (e) => e.classList.add("hidden"));
    }
  } catch (err) {
    console.log("Error updating UI!", err);
    return;
  }

  console.log("UI updated");
};

const updateUIProfile = async () => {
  try {
    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
      const user = await auth0.getUser();
     // eachElement(".profile", (e) => e.classList.remove("hidden"));
      eachElement(".user-name", (e) => e.classList.remove("hidden"));
      eachElement(".user-email", (e) => e.classList.remove("hidden"));
      // document.getElementById("profile-data").innerText = JSON.stringify(
      //   user,
      //   null,
      //   2
      // );
     // document.querySelectorAll("pre code").forEach(hljs.highlightBlock);
      eachElement(".user_list", (e) => e.classList.add("hidden"));


    }
  } catch (err) {
    console.log("Error updating UI Profile!", err);
    return;
  }
};



window.onpopstate = (e) => {
  if (e.state && e.state.url && router[e.state.url]) {
    showContentFromUrl(e.state.url);
  }
};
