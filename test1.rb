#!/bin/env ruby
require 'json'
require 'net/http'

query1 = %q{
  {
    messages(limit: 100) {
      edges {
        text
        id
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}

query2 = %q{
  mutation {
    createMessage(text: "allo") {
      id
    }
  }
}

json = JSON.generate({ query: query1 })
uri = URI('http://localhost:8000/graphql')
uri = URI('http://localhost:8001/graphql')
#uri = URI('http://98.80.248.68:8000/graphql')
response = Net::HTTP.post(uri, json, "Content-Type" => "application/json")
puts JSON.pretty_generate(JSON.parse(response.body))
