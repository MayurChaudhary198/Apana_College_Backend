// const stu1 = {
//     name : "mayur",
//     age : 20,
//     marks : 95,
//     getMarks : function (){
//         return this.marks;
//     }
// }
// const stu2 = {
//     name : "mayur1",
//     age : 22,
//     marks : 79,
//     getMarks : function (){
//         return this.marks;
//     }
// }
// const stu3 = {
//     name : "mayur2",
//     age : 23,
//     marks : 90,
//     getMarks : function (){
//         return this.marks;
//     }
// }



////constructor-doesn`t return anything, start with capital latter 


function Person(name,age){
    this.name=name;
    this.age=age;
} 

Person.prototype.talk=function(){
    console.log(`hey,My Name is ${this.name}`);
}


let p1 = new Person("Mayur",24)
let p2 = new Person("Mayur1",24)