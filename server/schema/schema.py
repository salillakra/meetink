import strawberry
from resolvers import Query
from resolvers.mutations import Mutation

# Create the GraphQL schema
schema = strawberry.Schema(query=Query, mutation=Mutation)
