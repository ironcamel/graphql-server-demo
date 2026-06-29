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

query1 = %q{
  {
    users {
      email
      id
      username
      messages {text, id}
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
uri = URI('http://localhost:8001/graphql')
uri = URI('http://localhost:8000/graphql')
uri = URI('http://18.214.37.147:8000/graphql')
uri = URI('https://e1z93xw1kl.execute-api.us-east-1.amazonaws.com/default/graphql-fun')
uri = URI('https://oyelhfmyvjn5j3j73bsvqufvk40vkwqh.lambda-url.us-east-1.on.aws/default/graphql-fun')
response = Net::HTTP.post(uri, json, "Content-Type" => "application/json")
#puts response.body
puts JSON.pretty_generate(JSON.parse(response.body))
