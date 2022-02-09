const { fetch, fetchAll } = require('../../utils/postgress.js')

const PRODUCTS = `
	SELECT
		product_id,
		category_id,
		product_name,
		product_price,
		product_short_desc,
		product_long_desc,
		picture
	FROM products
	WHERE
	CASE
		WHEN $1 > 0 THEN product_id = $1
		ELSE TRUE
	END AND
	CASE
		WHEN LENGTH($4) > 0 THEN (
			product_name ILIKE CONCAT('%', $4, '%') 
		) ELSE TRUE
	END
    ORDER BY product_id
	offset $2 limit $3   
`

const ADD_PRODUCT=`
	INSERT INTO products(category_id,product_name,product_price,product_short_desc,product_long_desc,picture) values($1,$2,$3,$4,$5,$6)
	returning *
`
function add_product({category_id,product_name,product_price,product_short_desc,product_long_desc,picture}){
	return fetchAll(ADD_PRODUCT,category_id,product_name,product_price,product_short_desc,product_long_desc,picture)

}

const DELETE_PRODUCT=`
	DELETE FROM products WHERE product_id = $1
`
function delete_product({product_id}){
	return fetchAll(DELETE_PRODUCT,product_id)
}

const UPDATE_PRODUCT=`
	UPDATE products SET
	category_id = (
		CASE
			WHEN $1 > 0 THEN $1 ELSE products.category_id 
		END), 
	product_name=(
		CASE
			WHEN LENGTH($2) > 0 THEN $2 ELSE products.product_name 
		END),
	product_price=(
		CASE
			WHEN $3 > 0 THEN $3 ELSE products.product_price 
		END),
	product_short_desc=(
		CASE
			WHEN LENGTH($4) > 0 THEN $4 ELSE products.product_short_desc 
		END),
	product_long_desc=(
		CASE
			WHEN LENGTH($5) > 0 THEN $5 ELSE products.product_long_desc 
		END),
	picture=(
		CASE
			WHEN LENGTH($6) > 0 THEN $6 ELSE products.picture 
		END)
	WHERE product_id = $7
	returning *
`
function update_product({category_id,product_name,product_price,product_short_desc,product_long_desc,picture,product_id}){
	return fetchAll(UPDATE_PRODUCT,category_id,product_name,product_price,product_short_desc,product_long_desc,picture,product_id)
}

function products ({product_id, pagination:{page,limit},search }) {
	return fetchAll(PRODUCTS, product_id,(page-1)*limit,limit,search)

}


module.exports = {
	products,
	add_product,
	delete_product,
	update_product
}