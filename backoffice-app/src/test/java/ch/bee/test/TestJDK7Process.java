package ch.bee.test;

import com.bee.smartstadium.service.FindPathService;

import java.io.*;
import java.util.Scanner;
import java.util.concurrent.ExecutionException;

/**
 * Created by zaid on 22/01/2016
 * A bee-in-it java projects source.
 */
public class TestJDK7Process {

    public static void main(String[] args ) throws Exception{

        System.out.println("Started");

        System.out.println("exit : met fin au programme (commande valide sans condition).");
        System.out.println("load=<fichier> : le programme lit un fichier de configuration (décrit dans la REGLE1 : Validation du fichier de configuration d'une matrice). Si le fichier est bien chargé le programme écrit dans System.out \"OK\", sinon il écrit \"KO\". Quand le fichier est lu et qu'il est valide alors le programme garde en mémoire les données pour eviter de les recharger pour les calculs de chemin. La commande peut être exécutée plusieurs fois. La mise à jour du cache ne se fait que si le fichier lu est valide.");
        System.out.println("check=<fichier> : Valide un fichier décrit selon la REGLE1 : Validation du fichier de configuration d'une matrice. Si le fichier est bien chargé le programme écrit dans System.out \"OK\", sinon il écrit \"KO\".");
        System.out.println("statut : Affiche les informations du cache chargé en mémoire. Si le fichier de matrice n'est pas chargé, le statut affiche \"KO\".");
        System.out.println("find=(<x,y>);(<a,b>) : exemple : find=(1,1);(7,12) : Retourne le chemin le plus cours entre deux points avec <x,y> : coordonnées de départ et <a,b> : coordonnées d'arrivée.");
        System.out.println("------------------");
        System.out.println("statut");
        System.out.println("load=/Users/zaid/IdeaProjects/smartstadium/backoffice-app/src/main/resources/process/test.lgf");

        FindPathService s = new FindPathService();
        s.start();

        System.out.println("Status="+s.statut());
        System.out.println("Load="+s.load("/Users/zaid/IdeaProjects/smartstadium/backoffice-app/src/main/resources/process/test.lgf"));
        System.out.println("Find="+s.find("1","7"));
        System.out.println("Status="+s.statut());
        s.exit();

    }

}

