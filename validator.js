class Validator {
    validate(propertiesToCheck, entity) {
        const errors = [];
        propertiesToCheck.forEach(prop => {
            if (!entity[prop]) {
                errors.push(`${prop} is required.`);
            }
        });

        return errors.length ? errors : null;
    }
}

module.exports = Validator;