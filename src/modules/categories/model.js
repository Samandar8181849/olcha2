const { fetch, fetchAll } = require('../../utils/postgress.js')

const CATEGORYES = `
	SELECT
		category_id,
    	category_name
	FROM categories
	WHERE
	CASE
		WHEN LENGTH($1) > 0 THEN (
			category_name ILIKE CONCAT('%', $1, '%') 
		) ELSE TRUE
	END
    ORDER BY category_id
`

const ADD_CATEGORY=`
	INSERT INTO categories(category_name) values($1)
	returning *
`

const USERS = `
	SELECT
		user_id,
		role
	FROM users
	WHERE user_id = $1
`

const DELETE_CATEGORY=`
	DELETE FROM categories WHERE category_name = $1 OR category_id = $2
`

const UPDATE_CATEGORY=`
	UPDATE categories SET
	
	category_name = (
		CASE
			WHEN LENGTH($1) > 0 THEN $1 ELSE categories.category_name 
		END
	) WHERE category_id = $2
`


function categoryes ({search}) {
	return fetchAll(CATEGORYES, search)
}

function add_category ({category_name}) {
	return fetchAll(ADD_CATEGORY, category_name)
}

function update_category ({category_name,category_id}) {
	return fetchAll(UPDATE_CATEGORY, category_name,category_id)
}

function delete_category({category_name,category_id}){
	return fetchAll(DELETE_CATEGORY,category_name,category_id)
}

function user({user_id}){
	return fetchAll(USERS,user_id)
}


module.exports = {
	categoryes,
	add_category,
	user,
	delete_category,
	update_category
}