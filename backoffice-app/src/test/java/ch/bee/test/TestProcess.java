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

        String executable = " /bin/echo";
        executable="/Users/zaid/IdeaProjects/smartstadium/backoffice-app/src/main/resources/process/bee-smart-stadium-os";
        File workingDirectory= new File("/Users/zaid/IdeaProjects/smartstadium/backoffice-app/src/main/resources/process/");

        ProcessBuilder builder = new ProcessBuilder(executable);
        builder.directory(workingDirectory);
        Process process = builder.start();

        OutputStream stdin = process.getOutputStream(); // <- Eh?
        InputStream stdout = process.getInputStream();

        BufferedReader reader = new BufferedReader(new InputStreamReader(stdout));
        Scanner scan = new Scanner(System.in);
        while (scan.hasNext()) {
            System.out.println("Wait");
            String input = scan.nextLine();
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(stdin));

            writer.write(input);
            writer.flush();
            writer.close();

            Scanner scanner = new Scanner(reader);
         //   while (scanner.hasNextLine()) {
                System.out.println(scanner.nextLine());
            //}
        }
        System.out.println("End");
/*


        System.out.println("Started");
        String line;
        Scanner scan = new Scanner(System.in);

        String test = " /bin/echo";
        test="/Users/zaid/IdeaProjects/smartstadium/backoffice-app/src/main/resources/process/bee-smart-stadium-os";
        ProcessBuilder builder = new ProcessBuilder(test);
        builder.redirectErrorStream(true);
        Process process = builder.start();

        OutputStream stdin = process.getOutputStream ();
        InputStream stderr = process.getErrorStream ();
        InputStream stdout = process.getInputStream ();

        BufferedReader reader = new BufferedReader (new InputStreamReader(stdout));
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(stdin));

        while (scan.hasNext()) {
            String input = scan.nextLine();
            if (input.trim().equals("exit")) {
                System.out.println(">exit");
                // Putting 'exit' amongst the echo --EOF--s below doesn't work.
                writer.write("exit\n");
            } else {
                System.out.println(">"+input);
                writer.write(input); //"((" + input + ") && echo --EOF--) || echo --EOF--\n");
            }
            writer.flush();

            line = reader.readLine();
            writer.write("read");
            while (line != null && ! line.trim().equals("--EOF--")) {
                System.out.println ("Stdout: " + line);
                line = reader.readLine();
            }
            if (line == null) {
                break;
            }
        }
        System.out.println("End");
*/
    }
    /*

     */

    public static void main2(String[] args ) throws Exception{

        System.out.println("Started");

        ///Users/zaid/IdeaProjects/smartstadium/backoffice-app/src/main/resources/process/
        ProcessBuilder pr = new ProcessBuilder("/Users/zaid/IdeaProjects/smartstadium/backoffice-app/src/main/resources/process/bee-smart-stadium-os");
    //        .directory(new File("/Users/zaid/IdeaProjects/smartstadium/backoffice-app/src/main/resources/process/")) ;
        pr.redirectErrorStream(true);
        Process p = pr.start();
        int i=0;
        while (p.isAlive() && i < 15){
            p.getOutputStream().write("statut".getBytes());


            BufferedReader in = new BufferedReader(new InputStreamReader(p.getInputStream()));
            String line;
            while ((line = in.readLine()) != null) {
                System.out.println(line);
            }

            i++;
        }
        System.out.println("Stop");
    }

}




class StreamGobbler extends Thread
{
    InputStream is;
    String type;
    OutputStream os;

    StreamGobbler(InputStream is, String type)
    {
        this(is, type, null);
    }
    StreamGobbler(InputStream is, String type, OutputStream redirect)
    {
        this.is = is;
        this.type = type;
        this.os = redirect;
    }

    public void run()
    {
        try
        {
            PrintWriter pw = null;
            if (os != null)
                pw = new PrintWriter(os);

            InputStreamReader isr = new InputStreamReader(is);
            BufferedReader br = new BufferedReader(isr);
            String line=null;
            while ( (line = br.readLine()) != null)
            {
                if (pw != null)
                    pw.println(line);
                System.out.println(type + ">" + line);
            }
            if (pw != null)
                pw.flush();
        } catch (IOException ioe)
        {
            ioe.printStackTrace();
        }
    }
}