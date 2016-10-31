/* 

Write a simple queuing system in pure javascript.

The queue should implement add, view and delete methods. 
A viewed message will become invisible to other workers for 1 second unless it is deleted.
Messages should be returned in order they were added unless they have been deleted.

The add method takes a string as a message and returns a unique id for that message.

The view method takes no parameters and returns a hash containing the unique message
id assigned in the add method and the message itself.

The delete method takes the unique message id and returns true if the message was removed
within 1 second or false if we were too slow and the message is back in the queue.

Write your implementation in this file below.

Extra points: Do you see any problems with running this kind of queue in a production envrionment? 

*/

// *** Write your Queue class here *** //


// *** Finish your code here *** //

// Test code. Should output the following
/*
  Hey there world. How are you?
  Hey there world. How are you?
  Hey world. How are you?
  Hey world. How you?
*/
var queue = new Queue();
queue.add('Hey');
queue.add('there');
queue.add('world.');
queue.add('How');
queue.add('are');
queue.add('you?');

printQueue();

setTimeout(function(){
  printQueue();
}, 200);

setTimeout(function(){
  printQueue(1);
}, 1500);

setTimeout(function(){
  printQueue(3);
}, 3000);

setTimeout(function(){
  printQueue();
}, 4500);

// Private function
function printQueue(index){
  var i = 0;
  var messageHash = queue.view();
  var output = '';
  while(messageHash){
    output += messageHash.message;
    output += ' ';
    if(i++ == index) queue.remove(messageHash.messageId);
    messageHash = queue.view();
  }
  if(output) console.log(output);
}