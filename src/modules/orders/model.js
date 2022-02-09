const { fetch, fetchAll } = require('../../utils/postgress.js')

const ORDERS = `
	SELECT * from orders
`
const ORDER = `
	SELECT * from orders
	WHERE user_id = $1
`

const USER = `
	SELECT role from users
	WHERE user_id =$1
`
const ADD_ORDER = `
	INSERT INTO orders (product_id, total_price, is_paid,user_id) VALUES
	(Array[+$2], $3, $4,$1)
	returning *
`

const UPDATE = `
	UPDATE orders SET product_id = array_append(product_id, $1), total_price = $3,
	is_paid = (
		CASE
			WHEN $4 IN (true) THEN $4 ELSE orders.is_paid
		END
	)
	WHERE user_id = $2
	returning *
`

const PRICE = `
	SELECT 
		product_price
	FROM products p
	WHERE p.product_id = $1
`
const IS_ORDER = `
	SELECT 
		*
	FROM orders
	WHERE orders.user_id = $1
`
function add_order(user_id, product_id, price, is_paid){
	return fetchAll(ADD_ORDER,user_id, product_id, price, is_paid)
}

function price(product_id){
	return fetchAll(PRICE,product_id)
}

function orders(){
	return fetchAll(ORDERS)
}

function order(user_id){
	return fetchAll(ORDER,user_id)
}

function is_order(user_id){
	return fetchAll(IS_ORDER,user_id)
}

function user({user_id}){
	return fetchAll(USER,user_id)
}

function update_order({product_id, user_id , price, is_paid}){
	return fetchAll(UPDATE,product_id, user_id , price, is_paid)

}

module.exports = {
	orders,
	add_order,
	user,
	order,
	price,
	is_order,
	update_order
}