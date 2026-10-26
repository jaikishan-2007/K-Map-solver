
const btn = document.getElementById("generateBtn");
btn.addEventListener("click",function(){
    console.log("button clicked");

    const mintermsInput = document.getElementById("Minterms");
    console.log(mintermsInput.value);

    const Variable_select = document.getElementById("numVariables");
    console.log(Variable_select.value);

    if (mintermsInput.value.trim() === "") {
    console.log("Enter at least one minterm");
    return;
 }

    const minterms = mintermsInput.value.split(",");
    console.log(minterms);

    for (let i = 0; i < minterms.length; i++) {
    if (minterms[i].trim() === "") {
        console.log("Invalid input: empty minterm");
        return;
    }
 }

    const mintermNumbers = minterms.map(Number);
    console.log(mintermNumbers);

    const uniqueMinterms = [...new Set(mintermNumbers)];// ... indicates convert back to array from set
    console.log(uniqueMinterms);

    const Variable_select_number = Number(Variable_select.value);
    console.log(Variable_select_number);

  const isValidVariables = validateVariables(Variable_select_number);
const isValidMinterms = validateMinterms(uniqueMinterms, Variable_select_number);

console.log("Variables valid:", isValidVariables);
console.log("Minterms valid:", isValidMinterms);

if (!isValidVariables || !isValidMinterms) {
    return;
}

console.log("Validation passed");

fetch("/generate", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        variables: Variable_select_number,
        minterms: uniqueMinterms
    })
})
.then(response => response.json())
.then(data => {
    console.log(data);
});

});

function validateVariables(variableCount){
    switch(variableCount){
        case 2:
            return true;
        case 3:
            return true;
        case 4:
            return true;
            
        default:
            return false;
    }

}

function validateMinterms(minterms, variableCount){
    switch(variableCount){
        case 2:
            for(let i=0;i<minterms.length;i++){
                if(!Number.isInteger(minterms[i])){
                    console.log("Enter valid minterms for selected number of variables");
                    return false;
                }
                if(minterms[i] < 0 || minterms[i] > 3){
                    console.log("Enter valid minterms for selected number of variables");
                return false;
                }
            }
        return true;
        
        
        case 3:
            for(let i=0;i<minterms.length;i++){
                if(!Number.isInteger(minterms[i])){
                    console.log("Enter valid minterms for selected number of variables");
                    return false;
                }
                if(minterms[i] < 0 || minterms[i] > 7){
                    console.log("Enter valid minterms for selected number of variables");
                    return false;
                }
            }
        return true;
        

        case 4:
            for(let i=0;i<minterms.length;i++){
                if(!Number.isInteger(minterms[i])){
                    console.log("Enter valid minterms for selected number of variables");
                    return false;
                }
                if(minterms[i] < 0 || minterms[i] > 15){
                    console.log("Enter valid minterms for selected number of variables");
                return false;
                }
            
            }
        return true;
        

        default:
            console.log("Enter valid minterms for selected number of variables");
            return false;
            
    }


}