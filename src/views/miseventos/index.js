import React, { useState } from "react";
import { CCard, CCardBody, CCardTitle, CCardText, CButton, CContainer, CRow, CCol } from "@coreui/react";
import comprasData from "./data"; // Datos de las compras del usuario

function MisCompras() {
    const [compras, setCompras] = useState(comprasData);

    // Manejar cambios en el número de entradas
    const handleEntradasChange = (id, value) => {
        setCompras((prevCompras) =>
            prevCompras.map((compra) =>
                compra.id === id
                    ? { ...compra, entradas: Math.min(value, compra.maxEntradas) }
                    : compra
            )
        );
    };

    return (
        <CContainer>
            <h1>Mis Compras</h1>
            <CRow className="g-4">
                {compras.map((compra) => (
                    <CCol md="6" key={compra.id}>
                        <CCard>
                            <CCardBody>
                                <CCardTitle>{compra.evento}</CCardTitle>
                                <CCardText>
                                    <strong>Stand:</strong> {compra.stand} <br />
                                    <strong>Entradas asignadas:</strong> {compra.entradas}/{compra.maxEntradas}
                                </CCardText>
                                <input className="form-control"
                                    type="number"
                                    value={compra.entradas}
                                    min="0"
                                    max={compra.maxEntradas}
                                    onChange={(e) => handleEntradasChange(compra.id, parseInt(e.target.value, 10))}
                                    placeholder={`Máximo: ${compra.maxEntradas}`}
                                />
                                <CButton
                                    color="primary"
                                    style={{ marginTop: "10px" }}
                                    onClick={() => alert(`Has actualizado el stand ${compra.stand} con ${compra.entradas} entradas`)}
                                >
                                    Guardar
                                </CButton>
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>
        </CContainer>
    );
}

export default MisCompras;
