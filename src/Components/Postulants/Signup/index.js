import styles from './signup.module.css';
import Input from '../../Shared/Input';
import ButtonCancel from '../../Shared/Buttons/ButtonCancel';
import ButtonConfirm from '../../Shared/Buttons/ButtonConfirm';
import RemoveButton from '../../Shared/Buttons/ButtonRemove';
import ModalError from '../../Shared/Modals/ModalError';
import Checkbox from '../../Shared/Checkbox';
import TextArea from '../../Shared/TextArea';
import Select from '../../Shared/Select';
import AddButton from '../../Shared/Buttons/ButtonLittleAdd';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createPostulant, getPostulants } from '../../../redux/Postulants/thunks';
import { closeErrorModal } from '../../../redux/Postulants/actions';
import { Form, Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';

const Signup = () => {
  const error = useSelector((store) => store.postulants.error);
  const isLoading = useSelector((store) => store.postulants.isLoading);
  const dispatch = useDispatch();
  const history = useHistory();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/profiles`)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201 && response.status !== 204) {
          const status = `${response.status} ${response.statusText}`;
          return response.json().then(({ message }) => {
            if (message.message) throw { message: message.message, status };
            throw { message, status };
          });
        }
        return response.json();
      })
      .then((response) => {
        setProfiles(response.data);
      })
      .catch((error) => error);
  }, []);

  const validate = (formValues) => {
    const errors = {};
    // first name
    if (!formValues.firstName?.match(/^[a-zA-Z]+$/)) {
      errors.firstName = 'First name must contain only letters';
    }
    if (formValues.firstName?.length < 2) {
      errors.firstName = 'First name must be at least 2 letters';
    }
    // last name
    if (!formValues.lastName?.match(/^[a-zA-Z]+$/)) {
      errors.lastName = 'Last name must contain only letters';
    }
    if (formValues.lastName?.length < 2) {
      errors.lastName = 'Last name must be at least 2 letters';
    }
    // email
    if (!formValues.email?.match(/^[^@]+@[a-zA-Z]+\.[a-zA-Z]+$/)) {
      errors.email = 'Fill in a valid email format';
    }
    // password
    if (formValues.password?.search(/[a-zA-Z]/) < 0 || formValues.password?.search(/[0-9]/) < 0) {
      errors.password = 'Password must contain numbers and letters';
    } else if (formValues.password?.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    // address
    if (formValues.address?.search(/[a-zA-Z]/) < 0 || formValues.address?.search(/[0-9]/) < 0) {
      errors.address = 'Address must contain a name and a number';
    }
    // phoneNumber
    if (!formValues.phoneNumber?.toString().match(/^\d+$/)) {
      errors.phoneNumber = 'Phone number must contain only numbers';
    }
    if (formValues.phoneNumber?.length < 7 || formValues.phoneNumber?.length > 14) {
      errors.phoneNumber = 'Phone number must be between 7 and 14 numbers';
    }
    // contact range
    if (formValues.available) {
      if (formValues.from >= formValues.to) {
        errors.from = '"From" hour must be before "to" hour';
        errors.to = '"To" hour must be after "from" hour';
      }
    }
    // primary studies
    if (formValues.startDatePrimaryStudies >= formValues.endDatePrimaryStudies) {
      errors.startDatePrimaryStudies = '';
    }
    if (formValues.schoolPrimary?.length < 5) {
      errors.schoolPrimary = 'School must contain at least 5 characters';
    }
    if (formValues.schoolPrimary?.length > 50) {
      errors.schoolPrimary = 'School must be less than 50 characters';
    }
    // secondary studies
    if (formValues.schoolSecondary?.length < 5) {
      errors.schoolSecondary = 'School must contain at least 5 characters';
    }
    if (formValues.schoolSecondary?.length > 50) {
      errors.schoolSecondary = 'School must be less than 50 characters';
    }
    return errors;
  };

  const required = (value) => (value ? undefined : 'Required');

  const submitForm = (formValues) => {
    dispatch(
      createPostulant({
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        password: formValues.password,
        address: formValues.address,
        phone: formValues.phoneNumber,
        birthday: formValues.birthday,
        available: formValues.available,
        contactRange: {
          from: formValues.available ? formValues.from : '00:00',
          to: formValues.available ? formValues.to : '00:00'
        },
        profiles: formValues.profiles,
        studies: {
          primaryStudies: {
            startDate: formValues.startDatePrimaryStudies,
            endDate: formValues.endDatePrimaryStudies,
            school: formValues.schoolPrimaryStudies
          },
          secondaryStudies: {
            startDate: formValues.startDateSecondaryStudies,
            endDate: formValues.endDateSecondaryStudies,
            school: formValues.schoolSecondaryStudies
          },
          tertiaryStudies: formValues.tertiaryStudies,
          universityStudies: formValues.universityStudies,
          informalStudies: formValues.informalStudies
        },
        workExperience: formValues.workExperience
      })
    ).then((response) => {
      if (response) {
        history.push('/postulant/profile');
        dispatch(getPostulants);
      }
    });
  };

  return (
    <div className={styles.container}>
      <ModalError error={error} onConfirm={() => dispatch(closeErrorModal())} />
      <Form
        onSubmit={submitForm}
        validate={validate}
        mutators={{
          ...arrayMutators
        }}
        render={({
          handleSubmit,
          form: {
            mutators: { push }
          },
          pristine,
          submitting
        }) => {
          return (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.header}>
                <h2 className={styles.title}>Register</h2>
              </div>
              <h3>Personal Info</h3>
              <div className={styles.fields}>
                <div className={styles.columns}>
                  <Field
                    label={'First Name'}
                    name={'firstName'}
                    placeholder={'First Name'}
                    disabled={submitting}
                    component={Input}
                    validate={required}
                  />
                  <Field
                    label={'Email'}
                    name={'email'}
                    placeholder={'Email'}
                    type={'email'}
                    disabled={submitting}
                    component={Input}
                    validate={required}
                  />
                  <Field
                    label={'Address'}
                    name={'address'}
                    placeholder={'Address'}
                    disabled={submitting}
                    component={Input}
                    validate={required}
                  />
                  <Field
                    label={'Birth Date'}
                    name={'birthday'}
                    type={'date'}
                    disabled={submitting}
                    component={Input}
                    validate={required}
                  />
                  <Field
                    name={'available'}
                    label={'Available?'}
                    type={'checkbox'}
                    disabled={submitting}
                    component={Checkbox}
                  />
                </div>
                <div className={styles.columns}>
                  <Field
                    label={'Last Name'}
                    name={'lastName'}
                    placeholder={'Last Name'}
                    disabled={submitting}
                    component={Input}
                    validate={required}
                  />
                  <Field
                    label={'Password'}
                    name={'password'}
                    placeholder={'Password'}
                    type={'password'}
                    disabled={submitting}
                    component={Input}
                    validate={required}
                  />
                  <Field
                    label={'Phone Number'}
                    name={'phoneNumber'}
                    placeholder={'+54113062939'}
                    type={'tel'}
                    disabled={submitting}
                    component={Input}
                    validate={required}
                  />
                  <Field
                    name="profiles"
                    title={'Select a profile'}
                    label={'Profiles'}
                    object={profiles}
                    disabled={submitting}
                    component={Select}
                    validate={required}
                  />
                </div>
              </div>
              <h3>Contact Range</h3>
              <div className={styles.fields}>
                <div className={styles.columns}>
                  <Field
                    label={'From'}
                    name={'from'}
                    placeholder={'From'}
                    type={'time'}
                    disabled={submitting}
                    component={Input}
                    validate={required}
                  />
                </div>
                <div className={styles.columns}>
                  <Field
                    label={'To'}
                    name={'to'}
                    placeholder={'To'}
                    type={'time'}
                    disabled={submitting}
                    component={Input}
                    validate={required}
                  />
                </div>
              </div>
              <h3>Primary Studies</h3>
              <div className={styles.fields}>
                <div className={styles.columns}>
                  <Field
                    label={'Start Date'}
                    name={'startDatePrimaryStudies'}
                    placeholder={'Start Date'}
                    type={'date'}
                    disabled={submitting}
                    component={Input}
                    validate={required}
                  />
                  <Field
                    label={'School'}
                    name={'schoolPrimaryStudies'}
                    placeholder={'School'}
                    type={'text'}
                    disabled={submitting}
                    component={Input}
                    validate={required}
                  />
                </div>
                <div className={styles.columns}>
                  <Field
                    label={'Finish Date'}
                    name={'endDatePrimaryStudies'}
                    placeholder={'Finish Date'}
                    type={'date'}
                    disabled={submitting}
                    component={Input}
                    validate={required}
                  />
                </div>
              </div>
              <h3>Secondary Studies</h3>
              <div className={styles.fields}>
                <div className={styles.columns}>
                  <Field
                    label={'Start Date'}
                    name={'startDateSecondaryStudies'}
                    placeholder={'Start Date'}
                    type={'date'}
                    disabled={submitting}
                    component={Input}
                    validate={required}
                  />
                  <Field
                    label={'School'}
                    name={'schoolSecondaryStudies'}
                    placeholder={'School'}
                    type={'text'}
                    disabled={submitting}
                    component={Input}
                    validate={required}
                  />
                </div>
                <div className={styles.columns}>
                  <Field
                    label={'Finish Date'}
                    name={'endDateSecondaryStudies'}
                    placeholder={'Finish Date'}
                    type={'date'}
                    disabled={submitting}
                    component={Input}
                    validate={required}
                  />
                </div>
              </div>
              <h3>Tertiary Studies</h3>
              <FieldArray name="tertiaryStudies">
                {({ fields }) => (
                  <div>
                    {fields.map((ts, index) => (
                      <div key={ts} className={styles.containerFields}>
                        <div className={styles.removeButton}>
                          <RemoveButton onClick={() => fields.remove(index)} />
                        </div>
                        <div className={styles.fields}>
                          <div className={styles.columns}>
                            <Field
                              label={'Start Date'}
                              name={`${ts}.startDate`}
                              placeholder={'Start Date'}
                              type={'date'}
                              disabled={submitting}
                              validate={required}
                              component={Input}
                            />
                            <Field
                              label={'Institute'}
                              name={`${ts}.institute`}
                              placeholder={'Institute'}
                              type={'text'}
                              disabled={submitting}
                              validate={required}
                              component={Input}
                            />
                          </div>
                          <div className={styles.columns}>
                            <Field
                              label={'Finish Date'}
                              name={`${ts}.endDate`}
                              placeholder={'Finish Date'}
                              type={'date'}
                              disabled={submitting}
                              validate={required}
                              component={Input}
                            />
                            <Field
                              label={'Description'}
                              name={`${ts}.description`}
                              disabled={submitting}
                              component={TextArea}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className={styles.addButton}>
                      <AddButton
                        type="button"
                        onClick={() => push('tertiaryStudies', undefined)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}
              </FieldArray>
              <h3>University Studies</h3>
              <FieldArray name="universityStudies">
                {({ fields }) => (
                  <div>
                    {fields.map((us, index) => (
                      <div key={us} className={styles.containerFields}>
                        <div className={styles.removeButton}>
                          <RemoveButton onClick={() => fields.remove(index)} />
                        </div>
                        <div className={styles.fields}>
                          <div className={styles.columns}>
                            <Field
                              label={'Start Date'}
                              name={`${us}.startDate`}
                              placeholder={'Start Date'}
                              type={'date'}
                              disabled={submitting}
                              validate={required}
                              component={Input}
                            />
                            <Field
                              label={'Institute'}
                              name={`${us}.institute`}
                              placeholder={'Institute'}
                              type={'text'}
                              disabled={submitting}
                              validate={required}
                              component={Input}
                            />
                          </div>
                          <div className={styles.columns}>
                            <Field
                              label={'Finish Date'}
                              name={`${us}.endDate`}
                              placeholder={'Finish Date'}
                              type={'date'}
                              disabled={submitting}
                              validate={required}
                              component={Input}
                            />
                            <Field
                              label={'Description'}
                              name={`${us}.description`}
                              disabled={submitting}
                              component={TextArea}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className={styles.addButton}>
                      <AddButton
                        type="button"
                        onClick={() => push('universityStudies', undefined)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}
              </FieldArray>
              <h3>Informal Studies</h3>
              <FieldArray name="informalStudies">
                {({ fields }) => (
                  <div>
                    {fields.map((is, index) => (
                      <div key={is} className={styles.containerFields}>
                        <div className={styles.removeButton}>
                          <RemoveButton onClick={() => fields.remove(index)} />
                        </div>
                        <div className={styles.fields}>
                          <div className={styles.columns}>
                            <Field
                              label={'Start Date'}
                              name={`${is}.startDate`}
                              placeholder={'Start Date'}
                              type={'date'}
                              disabled={submitting}
                              validate={required}
                              component={Input}
                            />
                            <Field
                              label={'Institute'}
                              name={`${is}.institute`}
                              placeholder={'Institute'}
                              type={'text'}
                              disabled={submitting}
                              validate={required}
                              component={Input}
                            />
                          </div>
                          <div className={styles.columns}>
                            <Field
                              label={'Finish Date'}
                              name={`${is}.endDate`}
                              placeholder={'Finish Date'}
                              type={'date'}
                              disabled={submitting}
                              validate={required}
                              component={Input}
                            />
                            <Field
                              label={'Description'}
                              name={`${is}.description`}
                              disabled={submitting}
                              component={TextArea}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className={styles.addButton}>
                      <AddButton
                        type="button"
                        onClick={() => push('informalStudies', undefined)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}
              </FieldArray>
              <h3>Work Experience</h3>
              <FieldArray name="workExperience">
                {({ fields }) => (
                  <div>
                    {fields.map((we, index) => (
                      <div key={we} className={styles.containerFields}>
                        <div className={styles.removeButton}>
                          <RemoveButton onClick={() => fields.remove(index)} />
                        </div>
                        <div className={styles.fields}>
                          <div className={styles.columns}>
                            <Field
                              label={'Start Date'}
                              name={`${we}.startDate`}
                              placeholder={'Start Date'}
                              type={'date'}
                              disabled={submitting}
                              validate={required}
                              component={Input}
                            />
                            <Field
                              label={'Company'}
                              name={`${we}.company`}
                              placeholder={'Company'}
                              type={'text'}
                              disabled={submitting}
                              validate={required}
                              component={Input}
                            />
                          </div>
                          <div className={styles.columns}>
                            <Field
                              label={'Finish Date'}
                              name={`${we}.endDate`}
                              placeholder={'Finish Date'}
                              type={'date'}
                              disabled={submitting}
                              validate={required}
                              component={Input}
                            />
                            <Field
                              label={'Description'}
                              name={`${we}.description`}
                              disabled={submitting}
                              component={TextArea}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className={styles.addButton}>
                      <AddButton
                        type="button"
                        onClick={() => push('workExperience', undefined)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}
              </FieldArray>
              <div className={styles.button}>
                <ButtonCancel disabled={isLoading} onClick={() => history.push('/postulant')} />
                <ButtonConfirm disabled={submitting || pristine} type={'submit'} />
              </div>
            </form>
          );
        }}
      />
    </div>
  );
};

export default Signup;