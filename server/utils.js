function makeid(length){
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

const shuffleArray = (array) =>{
   return [...array].sort(()=> Math.random()-0.5)
}

module.exports = {
   makeid,
   shuffleArray
}

