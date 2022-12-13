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