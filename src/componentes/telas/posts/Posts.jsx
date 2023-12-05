import { useState, useEffect } from "react";
import PostsContext from "./PostsContext";
import Tabela from "./Tabela";
import Form from "./Form";
import Carregando from "../../comuns/Carregando";
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import { auth } from '../../../firebaseConfig';
import { useAuthState } from "react-firebase-hooks/auth";
import { deletePostFirebase, addPostFirebase, updatePostFirebase, getPostsUIDFirebase } from '../../servicos/PostsService';
import { Navigate } from "react-router-dom";

function Posts() {

    const [user, loading, error] = useAuthState(auth);

    const [alerta, setAlerta] = useState({ status: "", message: "" });
    const [listaObjetos, setListaObjetos] = useState([]);
    const [editar, setEditar] = useState(false);
    const [objeto, setObjeto] = useState({
        id: "", titulo: "", texto: "", tipo: "", url: "",
        uid: user?.uid, usuario: user?.displayName, email: user?.email
    });
    const [carregando, setCarregando] = useState(true);
    const [abreDialogo, setAbreDialogo] = useState(false);

    const novoObjeto = () => {
        setEditar(false);
        setAlerta({ status: "", message: "" });
        setObjeto({
            id: "", titulo: "", texto: "", tipo: "", url: "",
            uid: user?.uid, usuario: user?.displayName, email: user?.email
        });
        setAbreDialogo(true)
    }

    const editarObjeto = async (objeto) => {
        setObjeto(objeto);
        setAbreDialogo(true);
        setEditar(true);
        setAlerta({ status: "", message: "" });
    }

    const acaoCadastrar = async e => {
        e.preventDefault();
        if (editar) {
            try {
                await updatePostFirebase(objeto);
                setAlerta({ status: "success", message: "Post atualizado com sucesso" });
            } catch (err) {
                setAlerta({ status: "error", message: "Erro ao atualizar o POST:" + err });
            }
        } else { // novo 
            try {
                setObjeto(await addPostFirebase(objeto));
                setEditar(true);
                setAlerta({ status: "success", message: "Post criado com sucesso" });
            } catch (err) {
                setAlerta({ status: "error", message: "Erro ao criar o POST:" + err });
            }
        }
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setObjeto({ ...objeto, [name]: value });
    }

    const remover = async (objeto) => {
        if (window.confirm("Remover este objeto?")) {
            try {
                deletePostFirebase(objeto);
                setAlerta({ status: "success", message: "Post removido com sucesso!" });
            } catch (err) {
                setAlerta({ status: "error", message: "Erro ao  remover: " + err });
            }
        }
    }


    useEffect(() => {
        setCarregando(true);
        if (user?.uid != null) {
            const uid = user?.uid;
            getPostsUIDFirebase(uid, setListaObjetos);
        }
        setCarregando(false);
    }, [user]);

    return (
        <PostsContext.Provider value={{
            alerta, setAlerta,
            listaObjetos, setListaObjetos,
            remover, user,
            objeto, setObjeto,
            editarObjeto, novoObjeto, acaoCadastrar,
            handleChange, abreDialogo, setAbreDialogo
        }}>
            <Carregando carregando={carregando}>
                <div style={{ padding: '20px' }}>
                    <Typography variant="h5" component="div">
                        Firebase com Firestore - Posts - PWA
                    </Typography>
                    <Form />
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
                            }} onClick={() => novoObjeto()}>
                                {user?.uid != null &&
                                    <CardContent sx={{ textAlign: "center", paddingTop: "100px" }}>
                                        <AddIcon sx={{ transform: "scale(2.7)" }} />
                                    </CardContent>}
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
            </Carregando>
            <Form />
        </PostsContext.Provider>);


}

export default Posts;