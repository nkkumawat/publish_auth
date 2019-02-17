const responseCodes = {
    ok: 200,
    created: 201,
    nonAuthorized: 203,
    partialContant: 206,
    unAuthorized: 401,
    notFound: 404,
    internalError: 500,
    invalidRequest: 422,
    userAlreadyExists: 800,
    passwordMismatch: 801,
    noUserExists: 802,
    productAlreadyExists: 803,
    noProductExists: 804,
    noInstructionExists: 805,
    enterDifferentPassword: 806,
    positionExists: 807,
    noRecipeExists: 808,
    alreadyExists: 900,
 }

module.exports = responseCodes;