package ch.bee.test;

import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.FileSystemUtils;

import java.io.FileWriter;
import java.nio.file.Files;
import java.util.*;

/**
 * Created by BZ02973 on 07.01.2016.
 */
public class Main  {

    private static Map<String, Integer> nodes = new HashMap<>();
    private static List<String> arcs = new ArrayList<>();

    // Coordonnées des champs désactivés :
    // row index, disables cols
    private static List<String> disabled = new ArrayList<>();

    private static int gridRow = 7;
    private static int gridCol = 6;


    private static void disableEnabled(int row, int... cols){
        for(int col: cols){
            disabled.add(row+","+col);
        }
    }
    private static boolean isEnabled(int row, int col){
        return !disabled.contains(row+","+col);
    }

    private static void loadNodes(){
        nodes.clear();
        int nodeLabel = 1;
        //Put all available nodes
        for(int row=1;row<=gridRow;row++){
            for(int col=1;col<=gridCol;col++){
                if(isEnabled(row, col)) {
                    nodes.put(row+","+col, nodeLabel);
                }
                nodeLabel++;
            }
        }
    }

    private static int getLabel(int row, int col) {
        if(isEnabled(row, col) && nodes.containsKey(row+","+col)){
            return nodes.get(row+","+col);
        }else{
            return -1;
        }
    }
        private static void loadEdge(){
        arcs.clear();
        //Put all available nodes
        for(int row=1;row<=gridRow;row++){
            for(int col=1;col<=gridCol;col++){

                Integer nodeFrom = getLabel(row, col);
                if(nodeFrom > -1){
                    int[] r = new int[]{
                            (row - 1), (row), (row +1)
                    };
                    int[] c = new int[]{
                            (col - 1), (col), (col +1)
                    };
                    for(int nextR : r){
                        for(int nextC : c){
                            if(!(nextR == row && nextC == col) && getLabel(nextR, nextC) > -1){
                                Integer nodeTo = getLabel(nextR, nextC);
                                arcs.add(nodeFrom+"\t"+getLabel(nextR, nextC));
                            }
                        }
                    }
                }
            }
        }
    }



    public static void main(String[] args){
        /*
        disabled.put(3, Arrays.asList(3, 4));
        disabled.put(4, Arrays.asList(3, 4));
        disabled.put(5, Arrays.asList(3, 4));
        */
        disableEnabled(3, 3, 4);
        disableEnabled(4, 3, 4);
        disableEnabled(5, 3, 4);
        loadNodes();
        loadEdge();

        StringBuilder nodeConf = new StringBuilder();
        nodeConf.append("@nodes").append("\n");
        nodeConf.append("label").append("\n");
        List<Integer> nds = new ArrayList<>(nodes.values());
        Collections.sort(nds);
        for(Integer next : nds){
            nodeConf.append(next).append("\n");
        }
        nodeConf.append("@arcs").append("\n");
        nodeConf.append("\t\t-").append("\n");
        for(String next : arcs){
            nodeConf.append(next).append("\n");
        }
        System.out.println(nodeConf);
        try {

            //FileCopyUtils.copy(nodeConf.toString(), new FileWriter("C:/tmp/config.lgf"));
        }catch (Exception e) {

        }
        /*
        @nodes
        label
         */
    }
}
