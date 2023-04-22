# Juno Tutorial Part 2
## Accessing Javascript, Namespaces and Macros

This is part 2 of the Juno Language Tutorial.  To get to part 1, go to (tutorial)[tutorial.md].

----
In the first tutorial, we covered the basics of the language: syntax, quoting, values and symbols, operators, forms, and functions.  Having a this foundation will get you far in the language.  This next part goes into more detail regarding those areas and introduces new concepts.   The objective here is to deepen your understanding of key ideas so that you become a more effective programmer of the Juno language.

☞ This tutorial assumes you are working within the Seedling IDE.  Many examples will be inefficient to type in at the command line Juno REPL, and you'll want to use the buffers of the IDE to refine and revise your code.  

----

The purpose of Juno is to allow the programmer to combine the power and flexibility of Lisp with JavaScript environments, whether it be the browser, Deno, or other containers.  Naturally then we will need an ability to access JavaScript resources in an efficient manner that integrates the Lisp environment effectively. 

Accessing environment