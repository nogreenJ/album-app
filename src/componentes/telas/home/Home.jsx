import { useState, useEffect } from "react";
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import { getPostsFirebase } from '../../servicos/PostsService';

function Home() {

    const [listaObjetos, setListaObjetos] = useState([]);

    useEffect(() => {
        getPostsFirebase(setListaObjetos);
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h5" component="div">
                Firebase com Firestore - Posts - PWA
            </Typography>
            {listaObjetos.length === 0 && <Typography variant="h5" component="div">
                Nenhum registro encontrado
            </Typography>}

            {listaObjetos.length === 0 && <h2>Nenhum registro encontrado</h2>}

            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}
                    key="0">
                    <Card sx={{
                        minWidth: 50, minHeight: 226,
                        "&:hover": { cursor: "pointer", backgroundColor: "lightgrey" },
                    }}>
                        <CardContent sx={{ textAlign: "center", paddingTop: "100px" }}>
                            <AddIcon sx={{ transform: "scale(2.7)" }} />
                        </CardContent>
                    </Card>
                </Grid>
                {listaObjetos.length > 0 && (
                    listaObjetos.map(objeto => (
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}
                            key={objeto.id}>
                            <Card sx={{ minWidth: 50, minHeight: 226 }}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        {objeto.tipo}
                                    </Typography>
                                    <Typography variant="h5" component="div">
                                        {objeto.titulo}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        {objeto.texto}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        <Link href={objeto.url}
                                            target="_blank" rel="noreferrer">Link</Link>
                                    </Typography>
                                    <Typography variant="h7" component="div">
                                        {objeto.usuario}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        {objeto.email}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))

                )}
            </Grid>

        </div>
    )
}

export default Home;