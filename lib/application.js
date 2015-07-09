/**
 * Created by dverma on 11/05/15.
 */

//Creating Applications
/*
 --request POST \
 --header "iPlanetDirectoryPro: AQIC5..." \
 --header "Content-Type: application/json" \
 --data '{
 "name": "myApplication",
 "resources": [
 "http://www.example.com:8080/*",
 "http://www.example.com:8080/*?*"
 ],
 "actions": {
 "UPDATE": true,
 "PATCH": true,
 "QUERY": true,
 "CREATE": true,
 "DELETE": true,
 "READ": true,
 "ACTION": true
 },
 "conditions": [
 "AND",
 "OR",
 "NOT",
 "AMIdentityMembership",
 "AuthLevel",
 "AuthScheme",
 "AuthenticateToRealm",
 "AuthenticateToService",
 "IPv4",
 "IPv6",
 "LDAPFilter",
 "LEAuthLevel",
 "OAuth2Scope",
 "ResourceEnvIP",
 "Session",
 "SessionProperty",
 "SimpleTime"
 ],
 "realm": "/",
 "applicationType": "iPlanetAMWebAgentService",
 "description": "An example application",
 "resourceComparator": "com.sun.identity.entitlement.URLResourceName",
 "subjects": [
 "AND",
 "OR",
 "NOT",
 "AuthenticatedUsers",
 "Identity",
 "JwtClaim"
 ],
 "entitlementCombiner": "DenyOverride",
 "saveIndex": null,
 "searchIndex": null,
 "attributeNames": []
 }' \
 https://openam.example.com:8443/openam/json/applications/?_action=create
 */
//Reading Applications
/*
 --header "iPlanetDirectoryPro: AQIC5..." \
 https://openam.example.com:8443/openam/json/applications/myApplication
 */
//Updating Applications
/*
 --request PUT \
 --header "iPlanetDirectoryPro: AQIC5..." \
 --header "Content-Type: application/json" \
 --data '{
 "name": "myApplication",
 "resources": [
 "http://www.example.com:8080/*",
 "http://www.example.com:8080/*?*"
 ],
 "actions": {
 "UPDATE": false,
 "PATCH": false,
 "QUERY": true,
 "CREATE": false,
 "DELETE": false,
 "READ": true,
 "ACTION": false
 },
 "conditions": [
 "SimpleTime"
 ],
 "realm": "/",
 "applicationType": "iPlanetAMWebAgentService",
 "description": "Updated application with fewer conditions and subjects",
 "resourceComparator": "com.sun.identity.entitlement.URLResourceName",
 "subjects": [
 "AuthenticatedUsers",
 "JwtClaim"
 ],
 "entitlementCombiner": "DenyOverride",
 "saveIndex": null,
 "searchIndex": null,
 "attributeNames": []
 }' \
 https://openam.example.com:8443/openam/json/applications/myApplication
 */
//Deleting Applications
/*
 --request DELETE \
 --header "iPlanetDirectoryPro: AQIC5..." \
 https://openam.example.com:8443/openam/json/applications/myApplication
 */
//Listing Applications
/*
 --header "iPlanetDirectoryPro: AQIC5..." \
 https://openam.example.com:8443/openam/json/applications?_queryFilter=true
 */