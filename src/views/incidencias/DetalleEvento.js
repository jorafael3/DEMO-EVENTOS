import React from "react";
import { useSearchParams } from "react-router-dom";
import { CButton, CCard, CCardBody, CCardTitle, CCardText, CContainer, CRow, CCol } from "@coreui/react";
import datos_eventos from "./data"; // Importa los datos

function DetalleEvento() {
    const [searchParams] = useSearchParams();
    const eventId = searchParams.get("id");



    // Encuentra el evento correspondiente
    const evento = datos_eventos.find((e) => e.id === parseInt(eventId));

    if (!evento) {
        return <h1>Evento no encontrado</h1>;
    }

    return (
        <CContainer>
            <h1>{evento.nombre}</h1>
            <h3>Ubicaciones Disponibles:</h3>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <img
                    src={evento.imagenMapa}
                    alt={`Mapa de ${evento.nombre}`}
                    style={{ maxWidth: "100%", height: "200px", borderRadius: "8px" }}
                />
            </div>
            <CRow className="g-4">
                {evento.ubicaciones.map((ubicacion) => (
                    <CCol md="6" key={ubicacion.id}>
                        <CCard>
                            <CCardBody>
                                <CCardTitle>{ubicacion.nombre}</CCardTitle>
                                <CCardText>
                                    <strong>Precio:</strong> {ubicacion.precio} <br />
                                    <strong>Estado:</strong> {ubicacion.estado} <br />
                                </CCardText>
                                {ubicacion.estado === "Disponible" ? (
                                    <CButton
                                        color="success"
                                        onClick={() =>
                                            alert(`Reservaste la ubicación: ${ubicacion.nombre}`)
                                        }
                                    >
                                        Reservar
                                    </CButton>
                                ) : (
                                    <CButton color="secondary" disabled>
                                        Reservado
                                    </CButton>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>
        </CContainer>
    );
}

export default DetalleEvento;
