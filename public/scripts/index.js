class User{
  constructor(name, password, role){
    this.name = name;
    this.password = password;
    this.role = role;
  }
};

class Tienda{
  constructor(config){
    this.config = config;
    this.productos = [];
  };
   
  getProducts = async (id = "", callback, callback2) => {
    fetch(this.config.fetchUrl + id)
    .then( response => response.json())
    .then(data =>  {
      this.productos = data 
      this.renderShop()
    })
  }


  renderShop = () => {
    document.getElementById(this.config.divProductos).innerHTML = this.productos.map( producto => `
      <div class="d-inline-flex p-2 col-2" >
        <div class="card" style="width: 15rem;">
          <img src="${producto.foto}" style="height:18rem;" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">${producto.descripcion}</p>
            <p class="card-text">Codigo: ${producto.codigo}</p>
            <p class="card-text">Precio: ${producto.precio}</p>
            <p class="card-text">Stock: ${producto.stock}</p>
            ${ISADMIN && `
              <span class="modifyButtons">
                  <button onclick="modifyProduct(${producto.id})" class="btn btn-primary">Update</button>
                  <buttonEliminar onclick="deleteProduct(${producto.id})" class="btn btn-secondary">Borrar</button>
              </span>
            `}
          </div>
        </div>
      </div>
    `).join("")
  }

  editProduct = (id) => {
    this.populateInputs(this.productos.find(item => item.id == id))
    document.getElementById(this.config.edit.formEditar).innerHTML = `
        <button onclick="sendPut(${id})" class="btn btn-warning" value="Modificar">Modificar</button>
        <button onclick="cancelButton()" class="btn btn-danger" value="Modificar">Cancelar</button>
    `
  }
  
  populateInputs = (data = {}) => {
    let inputs = [...document.getElementsByTagName('input')]
    inputs.forEach(input => {
        input.value = data[input.name] || ""
    })
  }

}


const ISADMIN = true
let config = {
  fetchUrl:'/api/productos/',
  divProductos: 'list',
  edit: {formEditar: 'formBotonModificar'}
}
const tienda = new Tienda(config)



tienda.getProducts()
/////////////////////////////////////////////////


/*

function deleteProduct(id) {
    multiusageFetch(id, "DELETE", null, "Borrado exitoso.")
}

function sendPut(id){
    const data = getFormData(null)
    multiusageFetch(id, "PUT", data, "Modificacion exitosa.")
}

function sendPost() {
    const data = getFormData()
    multiusageFetch(null, "POST", data, "Nuevo objeto creado satisfactoriamente.")
}


function getFormData(id) {
    
    var formData = $('form').serializeArray().reduce((obj, item) => {
        obj[item.name] = item.value;
        return obj;
    }, {});

    const data = {...formData,
        id:id,
        timestamp:Date.now()
    }

    return data
}


function multiusageFetch(id, method, data, successMessage) {
    let path = ""
    let body = ""

    if(id==null){
        path = '/api/productos'
    }else{
        path = '/api/productos/'+id
    }

    if(data==null){
        body=""
    }else{
        body=JSON.stringify(data)
    }

    fetch(path, {
        method:method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
    .then( () => {
        window.alert(successMessage)
        window.location.reload()
    })
    .catch(err => {
        console.log(err)   
    })
}

function cancelButton(){
    unPopulateInputs()
    $("#formBotonModificar").html("")
}
*/


