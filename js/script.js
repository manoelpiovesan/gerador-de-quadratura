document.querySelector('#btn-calcular').addEventListener('click', ()=>{
    Quadratura();
})

function Quadratura(){

    var n = Math.floor(document.querySelector('#ordem').value)

    if(n % 2 != 0){
        document.getElementById('err-msg').style.display = 'block';
        return
    }else{
        document.getElementById('err-msg').style.display = 'none';
    }


    var m = parseInt((n + 1)/2);
    var mi = []
    var w = []
    console.log(m)


    for(var i = 0; i < m-1; i++){

        var u = Math.cos(Math.PI * ((i + 0.75)/(n + 0.5)))
        do{
            var p1 = 1; p2=0;
            for(var j = 0; j < n; j++){
                var p3 = p2;
                p2 = p1;
                p1 = (((2 * j + 1) * u * p2) - (j * p3))/(j+1);
            }

            var dp = (n * ((u * p1) - p2))/(Math.pow(u,2)-1);
            var u1 = u
            u = u1 - (p1/dp);

            
        }while(Math.abs(u-u1) > Math.pow(10, -15));

        mi.push(u)
        mi.push(-u)

        var wTemp = 2/((1-Math.pow(u, 2)) * Math.pow(dp, 2))
        w.push(wTemp);
        w.push(wTemp);

        // w[i] = (2/((1-Math.pow(u, 2)) * Math.pow(dp, 2)));
        // w[n-i-1] = w[i]

        
    }
    
    generateTable(mi, w);
    console.log(mi)
    console.log(w)
}

function generateTable(mi, w){
    mi.forEach((miElement, miId) => {
        document.querySelector('#table-data-body').innerHTML += `<tr><th scope='row'>${miId + 1}</th><td>${miElement}</td><td>${w[miId]}</td></tr>`
    });
    
}