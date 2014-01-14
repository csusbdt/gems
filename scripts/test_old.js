# This script is used to test the revision conflict resolution code.
#
# To use this script, do the following:
#
# (1) In buy_gem.js, add a delay of 10 seconds between checkPassword and processRequest.
# (2) Run createdb.sh.
# (3) Start the app server.
# (4) Log in as 'a'.
# (5) Purchase a gem and then within 10 seconds run this script (test_old.sh).
# (6) Observe that the app client says "Please try again."

# S = server url
export S=http://admin:1234@localhost:5984

echo purchase a gem
curl -X PUT    ${S}/users/a -H "Content-type: application/json"         \
               -d "{\"_rev\": \"1-77fca66c49622d37646fff93edd77274\", \"_id\": \"a\", \"pw\": \"a\", \"balance\": 4, \"gems\": 1 }"


