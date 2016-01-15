#include <iostream>
#include <string>

#include "InputParser.hpp"
#include "MonumentGraph.hpp"

int main ()
{
    bool done = false;
    std::string inputString;

    MonumentGraph graph( &done );
    //graph.initGraph("test.lgf");
    //graph.printShortestPath(0,7);
    InputParser parser( &done , &graph );

    while (!done)
    {
        getline (std::cin, inputString);
        parser.parse(inputString);
    }

    return 0;
}

/*

exit : met fin au programme (commande valide sans condition).

load=<fichier> : le programme lit un fichier de configuration
(décrit dans la REGLE1 : Validation du fichier de configuration d'une matrice).
Si le fichier est bien chargé le programme écrit dans System.out "OK", sinon il écrit " KO".
Quand le fichier est lu et qu'il est valide alors le programme garde en mémoire les données
pour eviter de les recharger pour les calculs de chemin. La commande peut être exécutée
plusieurs fois. La mise à jour du cache ne se fait que si le fichier lu est valide.

check=<fichier> : Valide un fichier décrit selon la REGLE1 :
Validation du fichier de configuration d'une matrice. Si le fichier est bien chargé le
programme écrit dans System.out "OK", sinon il écrit " KO".

statut : Affiche les informations du cache chargé en mémoire. Si le fichier de matrice
n'est pas chargé, le statut affiche "KO".

find=(<x,y>);(<a,b>) : exemple : find=(1,1);(7,12) : Retourne le chemin le plus cours
-entre deux points avec <x,y> : coordonnées de départ et <a,b> : coordonnées d'arrivée.

*/
