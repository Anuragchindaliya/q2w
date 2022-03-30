# update content
1. public user
2. secure user

## process
1 check params roomid or content is sent or not
2 check password is sent or not
    
        if password is not sent that would be a public user public user sent request to update content
2.2 clean roomid & check roomid exist and room is not secure
2.3  clean content and get ip then update content to respective roomID

    if password is sent that would be a secure user 
    secure user sent request to update content

   
1.  clean password & check room is exist and with valid password
2.  
 