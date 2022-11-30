// document.querySelector('#btn-calcular').addEventListener('click', ()=>{
//     Quadratura();
// })

document.querySelector('#btn-calcular').addEventListener('click', ()=>{
    diamondDifference();
})



function Quadratura(){
    document.querySelector('#table-data-body').innerHTML = ''

    var n = parseInt(document.querySelector('#ordem').value) // Substituí o Math.floor() por parseInt

    if(n % 2 != 0){
        document.getElementById('err-msg').style.display = 'block';
        return
    }else{
        document.getElementById('err-msg').style.display = 'none';
    }


    var m = (n + 1)/2; // Tirei o parseInt daqui
    var mi;
    var w = []

    var miPos = []
    var miNeg = []

    var wPos = []
    var wNeg = []

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

        // mi.push(u)
        // mi.push(-u)
        
        miPos.push(u)
        miNeg.push(-u)
        
        var wTemp = 2/((1-Math.pow(u, 2)) * Math.pow(dp, 2))

        wPos.push(wTemp)
        wNeg.push(wTemp)

        miPos.sort()
        miNeg.sort()

        mi = miPos.concat(miNeg)

        w = wPos.concat(wNeg)

        // w.push(wTemp);
        // w.push(wTemp);
        
    }
    
    generateTable(mi, w);

    return [mi, w];
}

function generateTable(mi, w){
    mi.forEach((miElement, miId) => {
        document.querySelector('#table-data-body').innerHTML += `<tr><th scope='row'>${miId + 1}</th><td>${miElement}</td><td>${w[miId]}</td></tr>`
    });
    
}


function diamondDifference() {
    let [mi, w] = Quadratura()  // Chama a função para pegar as quadraturas
    let sigmaT = 1  // Seção de choque macroscópica total
    let sigmaSo = 0.5   // Seção de choque de espalhamento macroscópica total 
    let Q = 0   // Fonte
    let N = 4   // Quantidade de direções do fluxo
    let CC = [1,1,0,0]
    let h = 20 // tamanho da malha (comprimento)
    let nodos = 200 // quantidade de divisões (j)
    let deltaH = h/nodos // Intervalo de cada j

    let mesh = []   //Malha resultante
    var SSJArray = new Array(nodos).fill(0) // Array para colocar cada SSJ calculado

    // Cria um array de linhas e j colunas
    for(let i = 0; i < N; i++){
        mesh.push(Array(nodos-1).fill(0)) // criando com um elemento a menos para completar depois com a condição de contorno
    }


    // adiciona as condições de contorno (primeira metade no início e segunda metade no final
    CC.forEach((element, index)=>{
        if(index < (CC.length/2)){
            mesh[index].unshift(element)
        }else{
            mesh[index].push(element)
        }
    })
    
    // calculando SSJ's para todos os nodos
    for(var j = 1; j < nodos; j++){
        
        var sumSSJ = 0
        
        // somatorio do SSJ começando do inicio
        for(var n = 1; n <= N; n++){
            sumSSJ += w[n-1] * ((mesh[n-1][j-1] + mesh[n-1][j])/2)
        }
    
        SSJArray[j-1] = ((sigmaSo/2) * sumSSJ)
        
    }
    
    // varredura da esquerda pra direita para todos os J's (Mi > 0)
    for(var j = 1; j < nodos; j++){
        for(var m = 0; m < N/2; m++){
            mesh[m][j] = (mesh[m][j-1] * ((mi[m]/deltaH)-(sigmaT/2))+(SSJArray[j])+(Q))/((mi[m]/deltaH)+(sigmaT/2))
            console.log(`Ψ(m:${m+1},j:${(j/10).toFixed(1)}): ${mesh[m][j]}`)
        }
    }

    
    // varredura da direita pra esquerda para todos os J's (Mi < 0)
    for(var j = nodos-2; j >= 0; j--){

        // var sumSSJ = 0
        // // somatorio do SSJ começando do final
        // for(var n = 1; n <= N; n++){
        //    sumSSJ += w[n-1] * ((mesh[n-1][j] + mesh[n-1][j+1])/2)
        // }

        // var SSJ = (sigmaSo/2) * sumSSJ
        
        for(var m = N/2; m < N; m++){

            mesh[m][j] = (mesh[m][j+1] * ((mi[m]/deltaH)+(sigmaT/2))-(SSJArray[j])-(Q))/((mi[m]/deltaH)-(sigmaT/2))
            
            console.log(`Ψ(m:${m+1},j:${(j/10).toFixed(1)}): ${mesh[m][j]}`)
        }
    }
    
    console.log(mesh)
    console.log(SSJArray)
}

