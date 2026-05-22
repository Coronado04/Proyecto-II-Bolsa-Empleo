import {useEffect, useState} from 'react';
import "./Publico.css";

function Publico() {

    const [puestosState, setPuestosState] = useState({
        puestos:[]
    });

    const backend = "http://localhost:8080/api/publico";

    async function handleList(){

        const request = new Request(
            backend,
            {
                method:'GET',
                headers:{}
            }
        );

        const response = await fetch(request);

        if (!response.ok) {

            alert("Error: " + response.status);
            return;
        }

        const puestos = await response.json();

        setPuestosState({
            ...puestosState,
            puestos:puestos
        });
    }

    useEffect(() => {

        if(puestosState.puestos.length === 0)
            handleList();

    }, []);

    return (

        <>

            <h1>
                Bolsa de Empleo
            </h1>

            <p>
                Últimos 5 puestos públicos
            </p>

            <List list={puestosState.puestos}/>

        </>
    );
}

function List({list}){

    return (

        <div className={"puestos-grid"}>

            {
                list.map(
                    puesto =>

                        <Item
                            puesto={puesto}
                            key={puesto.id}
                        />
                )
            }

        </div>
    );
}

function Item({puesto}){

    return (

        <div className={"puesto-card"}>

            <strong>
                {puesto.empresa.nombre}
            </strong>

            <p>
                {puesto.descripcion}
            </p>

            <p>
                ₡ {puesto.salario}
            </p>

            <div className={"tooltip-wrap"}>

                <button className={"btn-sm"}>
                    Ver detalle
                </button>

                <div className={"tooltip-content"}>

                    <strong>
                        Características requeridas:
                    </strong>

                    <ul>

                        {
                            puesto.caracteristicas.map(
                                (c,index)=>

                                    <li key={index}>

                                        {c.caracteristica.nombre}

                                        {" "}
                                        (nivel {c.nivelDeseado})

                                    </li>
                            )
                        }

                    </ul>

                </div>

            </div>

        </div>
    );
}

export default Publico;