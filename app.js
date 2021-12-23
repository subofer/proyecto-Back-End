const express = require('express')
const { Router } = express
const Cart = require('./libs/Container.js')
const Products = require('./libs/Container.js')




const router_productos = Router()
const router_carrito = Router()

const app = express()

const PORT = 8080

const ISADMIN = true

app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))


const products = new Products(__dirname + '/data/productos.json')
const cart = new Cart(__dirname + '/data/carrito.json')

router_productos.get("/:id", (req, res) => res.json(products.find(req.params.id)) )

router_productos.get("/", (req, res) => res.json(products.list) )


router_productos.post("/", mwAdmin, (req, res) => {
    let post = products.insert(req.body)
    products.write()
    return res.json(post)
})

router_productos.put("/:id", mwAdmin, (req, res) => {
    let obj = req.body
    let id = req.params.id
    let put = res.json(products.update(id,obj))
    products.write()
    return put
})

router_productos.delete("/:id", mwAdmin, (req,res) => {
    let id = req.params.id
    let deleted = res.json(products.delete(id))
    products.write()
    return(deleted)
})



router_carrito.get("/", (req, res) => res.json(cart.list) )


router_carrito.post("/", (req, res) => {
    let obj = req.body
    let create = res.json(cart.cartCreate(obj))
    cart.write()
    return create
})


router_carrito.delete("/:id", (req,res) => {
    let id = req.params.id
    let deleted = res.json(cart.delete(id))
    cart.write()
    return(deleted)
})


router_carrito.get("/:id/productos", (req, res) => res.json(cart.find(req.params.id).productos))


router_carrito.post("/:id/productos", (req, res) => {
    let post = res.json( cart.cartInsert(req.params.id,req.body) )
    cart.write()
    return post
})

router_carrito.delete("/:id/productos/:idprod", (req,res) => {
    let deleted = res.json(cart.cartDelete(req.params.id, req.params.idprod))
    cart.write()
    return(deleted)
})


app.use('/api/productos', router_productos)
app.use('/api/carrito', router_carrito)

app.listen(process.env.PORT || PORT, () => {
    console.log(`Servidor inciado en puerto ${PORT}`)
})

app.use((err,req,res,next) => res.status(500).send('Ocurrio un error: '+err))

app.use((req,res,next) => {

    const error = {
        error:-2,
        descripcion:`ruta ${req.path} metodo ${req.method} no implementado.`
    }
    res.status(500).send(error)
})


function mwAdmin(req,res,next){
    if(ISADMIN){
        next()
    }else{
        const error={
            error:-1,
            descripcion: `Ruta ${req.url} metodo ${req.method} no autorizado.`
        }
        res.status(500).send(error)
    }
}