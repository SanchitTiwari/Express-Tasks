# Create a route for registration /user/register of method POST
 	
1. It will take parameters username, password, confirm password, email, id, firstname, and lastname
 		
2. In route it should verify that username is unique, email is also unique, password and confirm password should be matched.
 		
3. Passwords need to be encrypted by bcryptjs.
 		
4. If everything matches it should save data is users collection
 		
5. Use express-validator as middleware for validation of API, use proper mongoose validation, populate functions etc from mongoose.
 		
6. After registration, the user should be saved in the database.
 		
7. The API should return the message “User registered successfully” if successful or else it should return status code 400 with an error message.
