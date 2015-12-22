Echanges entre client et serveur : 
CSRF Protection : 
    Serveur ajoute un cookie XSRF-TOKEN au client
    Le client AngularJS requête le serveur avec X-XRSF-TOKEN en retour
    D'autres plateformes client utilisent X-CSRF-TOKEN