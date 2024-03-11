//CREATE AXIOS 


const axiosClient = axios.create({

    baseURL: `https://jsonplaceholder.typicode.com/`
})




// GET REQUEST
function getTodos() {
    // axios({
    //     method: 'get',
    //     url: 'https://jsonplaceholder.typicode.com/todos',
    //     params: {
    //         _limit: 5
    //     }

    // }).then(res => showOutput(res)).catch(err => console.error(err))

    axiosClient.get('/todos?_limit=5').then(res => showOutput(res)).catch(err => console.error(err));

}

// POST REQUEST
function addTodo() {
    axiosClient.post('/todos', { title: 'New ToDo', completed: false }).then(res => showOutput(res)).catch(err => console.error(err));
}

// PUT/PATCH REQUEST
function updateTodo() {

    //axiosClient.put('/todos/1', { title: 'Updated ToDo'  }).then(res => showOutput(res)).catch(err => console.error(err));

    // axiosClient.patch('/todos/2', { title: 'Updated ToDo'  }).then(res => showOutput(res)).catch(err => console.error(err));

    axios.all([
        axiosClient.put('/todos/1', { title: 'Updated ToDo' }),
        axiosClient.patch('/todos/2', { title: 'Patched ToDo' })
    ]).then(axios.spread((updated, patched) => showOutput(updated))).catch(err => console.error(err));
}

// DELETE REQUEST
function removeTodo() {

    axiosClient.delete('/todos/1').then(res => showOutput(res)).catch(err => console.error(err));
}

// SIMULTANEOUS DATA
function getData() {

    axios.all([
        axiosClient.put('/todos/1', { title: 'Updated ToDo' }),
        axiosClient.patch('/todos/2', { title: 'Patched ToDo' })
    ]).then(axios.spread((updated, patched) => showOutput(patched))).catch(err => console.error(err));
}

// CUSTOM HEADERS
function customHeaders() {
    const token = 'xxx-xxx-xxx';
    const config = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    }


    axiosClient.post('/todos', {
        title: 'News ToDo',
        completed: false
    }, config)
        .then(res => showOutput(res))
        .catch(err => console.log(err))
    //console.log('Custom Headers');
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {

    // axiosClient.post('/todos', {
    //      title: 'Welcome World' ,

    // }, {  transformResponse: axios.defaults.transformResponse.concat(data => {
    //     data.title = data.title.toUpperCase();
    //     return data;
    // })}).then(res => showOutput(res))
    //     .catch(err => console.log(err)) 

    const options = {
        method: 'post',
        url: '/todos',
        data: {
            title: 'Welcome World'
        }
        ,
        transformResponse: axios.defaults.transformResponse.concat(data => {
            data.title = data.title.toUpperCase();
            return data;
        })
    }

    axiosClient(options).then(res => showOutput(res))
        .catch(err => console.log(err))
}

// ERROR HANDLING
function errorHandling() {

    axiosClient.get('/todoss').then(res => showOutput(res)).catch(err => {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);

        if (err.response.status === 404) {
            alert('Error: Page Not Found')
        } else if (err.request) {
            console.error(err.request)
        } else {
            console.error(err.message)
        }
    })

    // console.log('Error Handling');
}

// CANCEL TOKEN
function cancelToken() {

    const source = axios.CancelToken.source();

    axiosClient.get('/todos', {cancelToken: source.token }).then(res=>showOutput(res)).catch(err => {
        if (axios.isCancel(err)) {
            console.log('Request Cancel', err.message)
        }
    });

    if(true){
        source.cancel('  cancelled')
    }
    //   console.log('Cancel Token');
}

// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use(
    config => {
        console.log(`${config.method} : used,  ${config.url} : url used. at ${new Date().getTime()}`);

        return config;
    }, error => {
        return Promise.reject(error)
    }
)
// AXIOS INSTANCES

// Show output in browser
function showOutput(res) {
    document.getElementById('res').innerHTML = `
    <div class="card card-body mb-4">
      <h5>Status: ${res.status}</h5>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Headers
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.headers, null, 2)}</pre>
      </div>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Data
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.data, null, 2)}</pre>
      </div>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Config
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.config, null, 2)}</pre>
      </div>
    </div>
  `;
}
// Event listeners




document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
    .getElementById('transform')
    .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);