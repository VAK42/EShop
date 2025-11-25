import { gql } from '@apollo/client'
export const getProducts = gql`query GetProducts($limit: Float!) { products(limit: $limit) { id title price stock category rating imageUrl description } }`
export const getProduct = gql`query GetProduct($id: Float!) { product(id: $id) { id title price stock category rating description sku imageUrl } }`
export const createProduct = gql`mutation CreateProduct($input: CreateProductInput!) { createProduct(input: $input) { id title } }`
export const updateProduct = gql`mutation UpdateProduct($input: UpdateProductInput!) { updateProduct(input: $input) { id title } }`
export const removeProduct = gql`mutation RemoveProduct($id: Float!) { removeProduct(id: $id) }`
export const getUsers = gql`query GetUsers { users { id name email role } }`
export const registerUser = gql`mutation Register($input: RegisterInput!) { register(input: $input) { id email } }`
export const getOrders = gql`query GetOrders { orders { id userId total status createdAt } }`
export const createOrder = gql`mutation CreateOrder($input: CreateOrderInput!) { createOrder(input: $input) { id total status } }`