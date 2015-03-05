gems
====

This is an example Web application that uses Nodejs and PostgrSQL.

The HTML is designed to work with ie8 and higher; [ie7 is not supported](http://theie7countdown.com/).

Note:

The following videos are old. After recording these videos,
I made the following changes:

* I changed the database from MongoDB to PostreSQL.
* I renamed \_id to id and \_rev to rev.
* I removed the request.checkPassword function because it operates with a side effect.
  I replaced this function with calls to request.getUserdoc and request.checkPassword.

After recording these videos, I also fixed a bug in buy_gem.js
and added test_old.sh under scripts to test this bug fix.

Videos:

- [Overview](http://youtu.be/ZY9M18nJ7IA)
- [How the client works](http://youtu.be/Ju-Ai55rFAs)
- [How the server works, part 1](http://youtu.be/TuOsxCl_2wo)
- [How the server works, part 2](http://youtu.be/awhe5O_LAUQ) 

