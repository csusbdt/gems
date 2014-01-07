# This script demonstrates how various operations work.

# S = server url
export S=http://admin:1234@localhost:5984

# delete existing databases if any
curl -X DELETE ${S}/users

# create database "users"
curl -X PUT    ${S}/users

# set admin as sole authorized user
curl -X PUT    ${S}/users/_security -H "Content-type: application/json" \
               -d @security.json

echo create user doc
curl -X POST   ${S}/users -H "Content-type: application/json"           \
               -d "{\"_id\": \"a\", \"pw\": \"a\", \"balance\": 5, \"gems\": 0 }"

echo create existing user doc
curl -X POST   ${S}/users -H "Content-type: application/json"           \
               -d "{\"_id\": \"a\", \"pw\": \"a\", \"balance\": 0, \"gems\": 0 }"

echo get user doc
curl -X GET    ${S}/users/a 

echo get nonexistant user doc
curl -X GET    ${S}/users/z 

echo purchase a gem
curl -X PUT    ${S}/users/a -H "Content-type: application/json"         \
               -d "{\"_rev\": \"1-77fca66c49622d37646fff93edd77274\", \"_id\": \"a\", \"pw\": \"a\", \"balance\": 4, \"gems\": 1 }"

echo purchase a gem with old revision string
curl -X PUT    ${S}/users/a -H "Content-type: application/json"         \
               -d "{\"_rev\": \"1-77fca66c49622d37646fff93edd77274\", \"_id\": \"a\", \"pw\": \"a\", \"balance\": 4, \"gems\": 1 }"

echo purchase a gem with deleted account
curl -X POST   ${S}/users -H "Content-type: application/json"           \
               -d "{\"_id\": \"b\", \"pw\": \"b\", \"balance\": 5, \"gems\": 0 }"
curl -X DELETE  ${S}/users/b?rev=2-15ba9aeff167c05b762286fd7f731949 

curl -X PUT    ${S}/users/b -H "Content-type: application/json"         \
               -d "{\"_rev\": \"2-15ba9aeff167c05b762286fd7f731949\", \"_id\": \"b\", \"pw\": \"b\", \"balance\": 3, \"gems\": 2 }"


