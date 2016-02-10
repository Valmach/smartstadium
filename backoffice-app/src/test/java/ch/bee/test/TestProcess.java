package ch.bee.test;

import java.io.*;
import java.util.Scanner;

/**
 * Created by zaid on 22/01/2016
 * A bee-in-it java projects source.
 */
public class TestProcess {

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

        String executable = " /bin/echo";
        executable="/Users/zaid/IdeaProjects/smartstadium/backoffice-app/src/main/resources/process/bee-smart-stadium-os";
        File workingDirectory= new File("/Users/zaid/IdeaProjects/smartstadium/backoffice-app/src/main/resources/process/");

        ProcessBuilder builder = new ProcessBuilder(executable);
        builder.directory(workingDirectory);
        Process process = builder.start();

        builder.redirectInput(ProcessBuilder.Redirect.PIPE);
        builder.redirectError(ProcessBuilder.Redirect.PIPE);
        builder.redirectOutput(ProcessBuilder.Redirect.PIPE);

        OutputStream stdin = process.getOutputStream ();
        InputStream stderr = process.getErrorStream ();
        InputStream stdout = process.getInputStream ();

        final BufferedReader reader = new BufferedReader (new InputStreamReader(stdout));
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(stdin));

        Thread t = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String line = reader.readLine();
                    while (line != null && ! line.trim().equals("--EOF--")) {
                        System.out.println ("Stdout: " + line);
                        line = reader.readLine();
                    }

                }catch (Exception e){
                    e.printStackTrace();
                }
            }
        });
        t.start();

        Scanner scan = new Scanner(System.in);

        while (scan.hasNext()) {
            String input = scan.nextLine();
            if (input.trim().equals("exit")) {
                // Putting 'exit' amongst the echo --EOF--s below doesn't work.
                writer.write("exit\n");
            } else {
                writer.write(input);
            }
            writer.flush();


            System.out.println("Next [statut ? load=<fichier> ? exit ? find=(1,1);(7,12) ? ]");
        }


        System.out.println("End");

    }


}

