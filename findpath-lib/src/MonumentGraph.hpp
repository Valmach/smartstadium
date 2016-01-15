#ifndef MONUMENTGRAPH_H
#define MONUMENTGRAPH_H

#include<iostream>
#include <exception>
#include <map>
#include <tuple>

#include <lemon/smart_graph.h>
#include <lemon/lgf_reader.h>
#include <lemon/dijkstra.h>


class MonumentGraph
{
private:
    bool * m_interrupt_ptr;                             // flag indiquant la demande d'interruption
    bool m_isGraphInitialised;                          // flag indiquant que le graphe est initialisé
    lemon::SmartDigraph m_graph;                        // le graphe représentant le monument
    std::map<int,std::tuple<int,int,double> > m_distMap;// conteneur des distances des arcs

public:
    /*
        constructeur et destructeur
    */
    MonumentGraph();
    MonumentGraph( bool * interrupt_ptr);
    ~MonumentGraph();

    /*
        méthodes d'initialisation et impression graphe
    */
    void initGraph( const std::string & filename );
    void printGraph(void);
    void printShortestPath( int fromVertex , int toVertex );
    bool isGraphValid(void);

private:
    void buildDistMap( lemon::SmartDigraph::ArcMap<double> & distMap );

};

#endif // MONUMENTGRAPH_H
