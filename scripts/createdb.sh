export DB=http://admin:1234@localhost:5984/gems
curl -X DELETE ${DB}
curl -X PUT    ${DB}
curl -X PUT    ${DB}/_security -H "Content-type: application/json" -d @security.json

curl -X POST   ${DB} -H "Content-type: application/json" -d '{"_id": "a", "pw": "a", "balance": 10, "gems": 0 }'
curl -X POST   ${DB} -H "Content-type: application/json" -d '{"_id": "b", "pw": "b", "balance": 0, "gems": 0 }'

curl -X GET    ${DB}/a

curl -X PUT    ${DB}/a -H "Content-type: application/json" -d '{"_id": "a", "_rev": "1-19bb9ed0bf4f53418d8ec26b19c0df37", "pw": "a", "balance": 5, "gems": 0 }'

curl -X GET    ${DB}/a

curl -X PUT    ${DB}/a -H "Content-type: application/json" -d '{"_id": "a", "_rev": "1-19bb9ed0bf4f53418d8ec26b19c0df37", "pw": "a", "balance": 100, "gems": 0 }'

curl -X GET    ${DB}/a
