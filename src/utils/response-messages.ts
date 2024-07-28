enum ResponseMessages {

    /**
   * Username specified does not exist or password does not match
   */
    BadLoginDetails = 'Invalid login details',

    ResourceNotFound = 'The resource you are looking for does not exist in the database',
    Request_Forbidden = "You are not allowed to make changes to this resource",
    UserAlreadyExists = "User Already Exist",
    ServerError = "Database Error" 

}

export default ResponseMessages