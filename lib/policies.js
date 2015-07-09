/**
 * Created by dverma on 11/05/15.
 */
//Creating Policies
/*--request PUT \
 --request POST \
 --header "iPlanetDirectoryPro: AQIC5..." \
 --header "Content-Type: application/json" \
 --data '{
 "name": "example",
 "active": true,
 "description": "Example Policy",
 "resources": [
 "http://www.example.com:80/*",
 "http://www.example.com:80/*?*"
 ],
 "actionValues": {
 "POST": false,
 "GET": true
 },
 "subject": {
 "type": "Identity",
 "subjectValues": [
 "uid=scarter,ou=People,dc=example,dc=com"
 ]
 }
 }' \
 https://openam.example.com:8443/openam/json/policies?_action=create
*/

//Reading Policies
/*
 --header "iPlanetDirectoryPro: AQIC5..." \
 https://openam.example.com:8443/openam/json/policies/example
 */

//Updating Policies
/*
 --request PUT \
 --header "iPlanetDirectoryPro: AQIC5w..." \
 --header "Content-Type: application/json" \
 --data '{
 "name": "example",
 "active": true,
 "description": "Updated example policy",
 "resources": [
 "http://www.example.com:80/*",
 "http://www.example.com:80/*?*"
 ],
 "actionValues": {
 "POST": true,
 "GET": true
 },
 "subject": {
 "type": "Identity",
 "subjectValues": [
 "uid=scarter,ou=People,dc=example,dc=com"
 ]
 }
 }' \
 https://openam.example.com:8443/openam/json/policies/example
 */

//Deleting Policies
/*
 --header "iPlanetDirectoryPro: AQIC5w..." \
 --request DELETE \
 https://openam.example.com:8443/openam/json/policies/myPolicy
 */

//Listing Policies
/*
 --header "iPlanetDirectoryPro: AQIC5w..." \
 https://openam.example.com:8443/openam/json/policies?_queryFilter=true
 */