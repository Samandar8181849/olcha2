const model = require('./model.js')
const jwt = require('jsonwebtoken')
let server_path = "http://localhost:4000"
const path = require ('path')
const fs = require ('fs')

const  { GraphQLUpload }= require( 'graphql-upload')


module.exports = {
	Query: {
		products: async(_,args) => {
			const product=await model.products(args)
			
			return product
		}
	},
	Mutation:{
		add_product: async(_,args,context)=>{
			if(context.token == '') throw new Error("token is required!")
			let { admin } = jwt.verify(context.token,"secret_key")
			if(admin != 'admin') throw new Error ('you are not admin')

			const { createReadStream, filename, mimetype, encoding } = await args.picture
			const stream = createReadStream()
			let as = filename.replace(/\s/g,'')
			const fileAddress = path.join(process.cwd(), 'files/images', as)
			const out = fs.createWriteStream(fileAddress)
			stream.pipe(out)
			let mimetype1 = mimetype.split('/')
			if(!(mimetype1[1] == 'png' || mimetype1[1] == 'jpg' ||  mimetype1[1] == 'jpeg')) throw new Error('the file must bee jpg or jpeg or png')
			args.picture = server_path+"/images/"+as

			const x=await model.add_product(args)
			return{
				status:200,
				message:"the new product added",
				data:x
			}
		},
		delete_product: async(_,args,context)=>{
			if(context.token == '') throw new Error("token is required!")
			let { admin } = jwt.verify(context.token,"secret_key")
			if(admin != 'admin') throw new Error ('you are not admin')
			const x=await model.delete_product(args)
			return{
				status:200,
				message:"the product deleted",
				data:x
			}
		},
		update_product: async(_,args,context)=>{
			if(context.token == '') throw new Error("token is required!")
			let { admin } = jwt.verify(context.token,"secret_key")
			if(admin != 'admin') throw new Error ('you are not admin')

			const { createReadStream, filename, mimetype, encoding } = await args.picture
			const stream = createReadStream()
			let as = filename.replace(/\s/g,'')
			const fileAddress = path.join(process.cwd(), 'files/images', as)
			const out = fs.createWriteStream(fileAddress)
			stream.pipe(out)
			let mimetype1 = mimetype.split('/')
			if(!(mimetype1[1] == 'png' || mimetype1[1] == 'jpg' ||  mimetype1[1] == 'jpeg')) throw new Error('file must bee jpg or jpeg or png')
			args.picture = server_path+"/images/"+as
			

			const x=await model.update_product(args)
			return{
				status:200,
				message:"the product updated",
				data:x
			}
		}

	},
	Upload: GraphQLUpload
}