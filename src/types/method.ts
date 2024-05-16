enum IMethod {
    POST = "POST",
    GET = "GET",
    PUT = "PUT",
    DELETE = "DELETE"
}

export const aType = {
    UG: 'UG (Under-Graduate/Bachelors)',
    PG: 'PG (Post-Graduate/Masters)',
    DIPLOMAUG: 'DIPLOMA-UG (Diploma Undergraduate)',
    DIPLOMAPG: 'DIPLOMA-PG (Diploma Postgraduate)',
    INTEGRATED: 'INTEGRATED (Integrated Degree)',
    CERTIFICATION: 'CERTIFICATION (Certification Program)',
    PHD: 'PHD (Doctor of Philosophy)'
};

export const getAdmissionType = (admissionType: string) => {
    return (aType as { [key: string]: string })[admissionType] || 'Unknown';
};

export default IMethod;