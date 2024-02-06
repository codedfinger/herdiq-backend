
const faker = require('faker'); //For testing purpose only
const moment = require('moment');

const Vaccine = require('../models/vaccine');
const Animal = require('../models/animal'); 
const Shed = require('../models/shed');

const limit_ = 5;

// @route GET api/event
// @desc Returns all breed with pagination
// @access Public

// @route POST api/event
// @desc Add a new event
// @access Public

exports.addVaccine = async (req, res) => {
    try {
        const userID = await req.user._id;
        console.log("user", userID);

        const { vaccineName, cycle, remark } = req.body;

        const newVaccine = new Vaccine({
            userID,
            vaccineName,
            cycle,
            remark,
        });

        const vaccine = await newVaccine.save();

        if (vaccine) {
            return res.status(200).json({
                success: true,
                status: 200,
                data: {
                    vaccine,
                    message: 'Vaccine added successfully',
                },
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            error: {
                message: error.message,
                reference_code: 'ERR-500-INTERNAL',
            },
        });
    }
};


// @route GET api/breed/{id}
// @desc Returns all vaccine
// @access Public
exports.getAllVaccines = async function (req, res) {
    try {
        const vaccines = await Vaccine.find();

        if (!vaccines || vaccines.length === 0) {
            return res.status(404).json({ message: 'No vaccine found' });
        }

        res.status(200).json({ vaccines });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/breed/{id}
// @desc Returns all goat breeds
// @access Public
exports.getUserVaccines = async function (req, res) {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters

        const vaccines = await Vaccine.find({ userID: id});

        if (!vaccines || vaccines.length === 0) {
            return res.status(404).json({ message: `No vaccine found for user with ID ${id}` });
        }

        res.status(200).json({ vaccines });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @route GET api/breed/{id}
// @desc Returns a specific breed
// @access Public
exports.getVaccine = async function (req, res) {
    try {
        const id = req.params.id;

        console.log('Received ID:', id);


        const vaccine = await Vaccine.findById(id);

        if (!vaccine) return res.status(401).json({message: 'Vaccine does not exist'});

        res.status(200).json({vaccine});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// @route PUT api/event/{id}
// @desc Update event details
// @access Public
exports.updateVaccine = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;

        const userID = req.user._id;

        console.log('Received ID:', userID);

        const vaccine = await Vaccine.findOneAndUpdate({_id: id, userID}, {$set: update}, {new: true});

        if (!vaccine) return res.status(401).json({message: 'Vaccine does not exist'});

        res.status(200).json({vaccine, message: 'Vaccine has been updated'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// @route PUT api/event/{id}
// @desc Update event details
// @access Public
exports.addVaccineToAnimal = async function (req, res) {
    try {
        const { tagID, firstDay, lastDay, cycle, remark } = req.body;
        const id = req.params.id;

        const userID = req.user._id;

        // check if vaccine exist
        const vaccine = await Vaccine.findOne({_id: id, userID});
        if (!vaccine) return res.status(401).json({message: 'Vaccine does not exist'});

        // Fetch the animal details based on tagID
        const animal = await Animal.findOne({tagID});
        if (!animal) return res.status(404).json({message: 'Animal not found for the provided tag ID'});

         // Check if the animal with tagID is has the vaccine added already
         const existingAnimal = vaccine.vaccineAnimals.find(animal => animal.tagID === tagID);
         if (existingAnimal) {
             return res.status(400).json({message: 'Vaccine already added to animal'});
         }

        // Update vaccineAnimals array
        vaccine.vaccineAnimals.push({
            name: animal.breedName,
            tagID: animal.tagID,
            gender: animal.gender,
            firstDay,
            lastDay,
            cycle,
            remark
        });

         // Save the updated Vaccine
         const updatedVaccine = await vaccine.save();

         // Update vaccine value in Animal model
        const existingVaccines = animal.vaccine || [];
        existingVaccines.push(vaccine.vaccineName);
        animal.vaccine = existingVaccines;
        await animal.save();


        res.status(200).json({vaccine: updatedVaccine, message: 'Vaccine has been updated with the new animal'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


// @route PUT api/vaccine/remove-vaccine-animal/{id}
// @desc Remove an animal from the vaccine
// @access Public
exports.removeVaccineFromAnimal = async function (req, res) {
    try {
        const { tagID } = req.body;
        const id = req.params.id;

        const userID = req.user._id;

        // check if vaccine exists
        const vaccine = await Vaccine.findOne({ _id: id, userID });
        if (!vaccine) return res.status(401).json({ message: 'Vaccine does not exist' });

        // Check if the animal with tagID is in the vaccine
        const existingAnimalIndex = vaccine.vaccineAnimals.findIndex(animal => animal.tagID === tagID);
        if (existingAnimalIndex === -1) {
            return res.status(400).json({ message: 'Animal not found in vaccine' });
        }

        // Remove the animal from shedAnimals array
        const removedAnimal = vaccine.vaccineAnimals.splice(existingAnimalIndex, 1);

        // Save the updated Vaccine
        const updatedVaccine = await vaccine.save();

       // Remove the vaccine from the array in Animal model
       const animal = await Animal.findOne({ tagID });
       if (animal) {
           const animalVaccineIndex = animal.vaccine.findIndex(v => v === vaccine.vaccineName);
           if (animalVaccineIndex !== -1) {
               animal.vaccine.splice(animalVaccineIndex, 1);
               await animal.save();
           }
       }

        res.status(200).json({ vaccine: updatedVaccine, removedAnimal, message: 'Animal removed from the vaccine' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route PUT api/vaccine/add-animals-from-shed/{id}
// @desc Add all animals from a shed to the vaccine
// @access Public
exports.addAnimalsFromShedToVaccine = async function (req, res) {
    try {
        const { shedName, firstDay, lastDay, cycle, remark } = req.body;
        const id = req.params.id;

        const userID = req.user._id;

        // check if vaccine exists
        const vaccine = await Vaccine.findOne({ _id: id, userID });
        if (!vaccine) return res.status(401).json({ message: 'Vaccine does not exist' });

        // Fetch the shed details based on shedName
        const shed = await Shed.findOne({ userID, shedName });
        if (!shed) return res.status(404).json({ message: 'Shed not found for the provided shed name' });

        // Iterate through animals in the shed
        for (const animalInShed of shed.shedAnimals) {
            const tagID = animalInShed.tagID;

            // Check if the animal is already in the vaccine
            const existingAnimal = vaccine.vaccineAnimals.find(animal => animal.tagID === tagID);
            if (existingAnimal) {
                console.log(`Animal with tagID ${tagID} is already in the vaccine. Skipping.`);
                continue;
            }

            // Fetch the animal details based on tagID
            const animal = await Animal.findOne({ tagID });
            if (!animal) {
                console.log(`Animal not found for tagID ${tagID}. Skipping.`);
                continue;
            }

            // Add the animal to the vaccine
            vaccine.vaccineAnimals.push({
                name: animal.breedName,
                tagID: animal.tagID,
                gender: animal.gender,
                firstDay,
                lastDay,
                cycle,
                remark
            });

            // Add the vaccine to the array in Animal model
            if (!animal.vaccine.includes(vaccine.vaccineName)) {
                animal.vaccine.push(vaccine.vaccineName);
                await animal.save();
            }
        }

        // Save the updated Vaccine
        const updatedVaccine = await vaccine.save();

        res.status(200).json({ vaccine: updatedVaccine, message: 'Animals from the shed added to the vaccine' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route PUT api/vaccine/remove-animals-from-shed/{id}
// @desc Remove animals from a shed in the vaccine
// @access Public
exports.removeAnimalsFromShedFromVaccine = async function (req, res) {
    try {
        const { shedName } = req.body;
        const id = req.params.id;

        const userID = req.user._id;

        // check if vaccine exists
        const vaccine = await Vaccine.findOne({ _id: id, userID });
        if (!vaccine) return res.status(401).json({ message: 'Vaccine does not exist' });

        // Fetch the shed details based on shedName
        const shed = await Shed.findOne({ userID, shedName });
        if (!shed) return res.status(404).json({ message: 'Shed not found for the provided shed name' });

        // Iterate through animals in the shed
        for (const animalInShed of shed.shedAnimals) {
            const tagID = animalInShed.tagID;

            // Check if the animal is in the vaccine
            const existingAnimalIndex = vaccine.vaccineAnimals.findIndex(animal => animal.tagID === tagID);
            if (existingAnimalIndex !== -1) {
                // Remove the animal from the vaccine
                const removedAnimal = vaccine.vaccineAnimals.splice(existingAnimalIndex, 1);

                // Clear vaccine value in Animal model
                const animal = await Animal.findOne({ tagID });
                if (animal) {
                    const animalVaccineIndex = animal.vaccine.findIndex(v => v === vaccine.vaccineName);
                    if (animalVaccineIndex !== -1) {
                        animal.vaccine.splice(animalVaccineIndex, 1);
                        await animal.save();
                    }
                }

                console.log(`Animal with tagID ${tagID} removed from the vaccine.`);
            } else {
                console.log(`Animal with tagID ${tagID} is not in the vaccine. Skipping.`);
            }
        }

        // Save the updated Vaccine
        const updatedVaccine = await vaccine.save();

        res.status(200).json({ vaccine: updatedVaccine, message: 'Animals from the shed removed from the vaccine' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @route DESTROY api/event/{id}
// @desc Delete Event
// @access Public
exports.deleteVaccine = async function (req, res) {
    try {
        const id = req.params.id;
        const userID = req.user._id;

        const vaccine = await Vaccine.findOneAndDelete({_id: id, userID});

        if (!vaccine) return res.status(401).json({message: "Vaccine does not exist or you don't have the required permission."});

        res.status(200).json({message: 'Breed has been removed'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


