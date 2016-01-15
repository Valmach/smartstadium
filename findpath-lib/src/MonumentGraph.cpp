#include "MonumentGraph.hpp"

MonumentGraph::MonumentGraph()
{
    m_interrupt_ptr = NULL;
    m_isGraphInitialised = false;

}

MonumentGraph::MonumentGraph( bool * interrupt_ptr )
{
    m_interrupt_ptr = interrupt_ptr;
    m_isGraphInitialised = false;
}

MonumentGraph::~MonumentGraph()
{
}

void MonumentGraph::initGraph( const std::string & filename )
{
    if(m_isGraphInitialised)
    {
        m_graph.clear();
    }

    try
    {
        lemon::SmartDigraph::ArcMap<double> distArc(m_graph);

        lemon::digraphReader(m_graph, filename). // lis de fichier et construit le graphe m_graph
        arcMap("distance", distArc).             // lis le champ 'distance'
        run();

        m_distMap.clear();
        int arcId,fromVertexId,toVertexId;
        double distance;
        for (lemon::SmartDigraph::ArcIt arcItr(m_graph); arcItr != lemon::INVALID; ++arcItr)
        {
            arcId = m_graph.id(arcItr);
            fromVertexId = m_graph.id( m_graph.source(arcItr) );
            toVertexId = m_graph.id( m_graph.target(arcItr) );
            distance = distArc[arcItr];
            m_distMap.insert ( std::pair<int, std::tuple<int,int,double> >(arcId, std::make_tuple (fromVertexId,toVertexId,distance) ) );
        }
        m_isGraphInitialised = true;
        std::cout << "OK" << std::endl;
    }
    catch ( std::exception & error )
    {
        // check if there was any error
        // std::cerr << "Error: " << error.what() << std::endl;
        std::cout << "NOK" << std::endl;
    }

    return;

}

void MonumentGraph::buildDistMap(lemon::SmartDigraph::ArcMap<double> & distMap )
{
    if(!m_isGraphInitialised)
    {
        return;
    }
    else
    {
        int arcId;//,fromVertexId,toVertexId;
        double distance;
        for(std::map<int, std::tuple<int,int,double> >::iterator itr = m_distMap.begin(); itr != m_distMap.end(); ++itr)
        {
            arcId = itr->first;
            //fromVertexId = std::get<0>(itr->second);
            //toVertexId = std::get<1>(itr->second);
            distance = std::get<2>(itr->second);
            //std::cout << "id: " << arcId << " source: " << fromVertexId << " to: " << toVertexId << " dist:" << distance << std::endl;
            distMap[m_graph.arcFromId(arcId)] = distance;
        }
    }
}

void MonumentGraph::printShortestPath( int fromVertex, int toVertex )
{
    // TODO check if vertices exist first

    lemon::SmartDigraph::ArcMap<double> distMap(m_graph);
    buildDistMap(distMap);

    lemon::Dijkstra< lemon::SmartDigraph , lemon::SmartDigraph::ArcMap<double> > pathComputer(m_graph,distMap);
    bool pathExist = pathComputer.run(m_graph.nodeFromId(fromVertex),m_graph.nodeFromId(toVertex));
    if(!pathExist)
    {
        std::cout << "KO" << std::endl;
    }
    else
    {
        // affichage à la console du chemin
        for (lemon::SmartDigraph::Node v = m_graph.nodeFromId(toVertex); v != m_graph.nodeFromId(fromVertex); v = pathComputer.predNode(v))
        {
            std::cout << m_graph.id(v) << "<-";
        }
        std::cout << fromVertex << std::endl;
    }

}

bool MonumentGraph::isGraphValid(void)
{
    return m_isGraphInitialised;
}

void MonumentGraph::printGraph(void)
{
    if (!m_isGraphInitialised)
    {
        std::cout << "KO" << std::endl;
    }
    else
    {
        lemon::SmartDigraph::ArcMap<double> distMap(m_graph);
        buildDistMap(distMap);
        lemon::digraphWriter(m_graph). // écriture du graphe sortie standard
        arcMap("distance", distMap).   // écriture de l'arc et des distances
        run();
    }
}

