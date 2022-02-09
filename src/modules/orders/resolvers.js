const model = require('./model.js')
const jwt = require('jsonwebtoken')

module.exports = {
	Query: {
		orders: async(_,args,context) => {
			if(context.token == '') throw new Error("token is required!")

			let { admin } = jwt.verify(context.token,"secret_key")
			if(admin=='admin'){return await model.orders()}

			let {user_id}=jwt.verify(context.token,"secret_key")
			if(user_id){return await model.order(user_id)}
		}
	},
	Mutation:{
		add_order: async (_, args, context) => {
			try{
				if(!context.token) throw new Error("Token key invalid!!!")
				let { user_id } = jwt.verify(context.token,"secret_key")
				
				args.user_id = user_id
		
				const [is_order] = await model.is_order(user_id)
				console.log(is_order)
				let product_id = +args.product_id
				let is_paid = args.is_paid
				let price = args.price 
				

				if(is_order == undefined){
					order = await model.add_order(user_id, product_id, price, is_paid)
					return {
						status: 200,
						message: "the order has been added",
						data: order
					}
				}

				if(is_order.is_paid == false){
					let total_price = +price + (+is_order.total_price)
					total_price = total_price + '' + '.000'
					order = await model.update_order(product_id, user_id,total_price,is_paid)
					return {
						status: 200,
						message: "the order has been added",
						data: order
					}
				}

				if(is_order.is_paid == true){
					order = await model.add_order(user_id, product_id, price, is_paid)
					return {
						status: 200,
						message: "the order has been added!",
						data: order
					}
				}
				} catch(error){
					return {
						status: 400,
						message: e.message
					}
				}
		}  
		
	}
}