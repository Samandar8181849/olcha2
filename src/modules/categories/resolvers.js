const model = require('./model.js')
const jwt = require('jsonwebtoken')


module.exports = {
	Query: {
		categoryes: async(_, { search }) => await model.categoryes({ search })
	},
	Mutation:{
		add_category: async(_,args,context)=>{
			if(context.token == '') throw new Error("token is required!")
			let { admin } = jwt.verify(context.token,"secret_key")
			if(admin != 'admin') throw new Error ('you are not admin')
			const x=await model.add_category(args)
			return{
				status:200,
				message:"the new category added",
				data:x
			}
		},
		delete_category: async(_,args,context)=>{
			if(context.token == '') throw new Error("token is required!")
			let { admin } = jwt.verify(context.token,"secret_key")
			if(admin != 'admin') throw new Error ('you are not admin')
			const x=await model.delete_category(args)
			return{
				status:200,
				message:"the category deleted",
				data:x
			}
		},
		update_category: async(_,args,context)=>{
			if(context.token == '') throw new Error("token is required!")
			let { admin } = jwt.verify(context.token,"secret_key")
			if(admin != 'admin') throw new Error ('you are not admin')
			const x=await model.update_category(args)
			return{
				status:200,
				message:"the category name updated",
				data:x
			}
		},

	}
}

// if(context.token == '') throw new Error("Token yoq")
// let { id } = jwt.verify(context.token,"Tommy")
// let user  = users.find(user => user.id == id)
// console.log(users)
// return [user]