import ActionPopupWithButton from '@/components/ui/modals/ActionPopupWithButton';
import React from 'react';
import TextInput from '@/components/ui/input/TextInput';
import link from '@/icons/main/link.svg';
import pen from '@/icons/main/feather.svg';
import add from '@/icons/main/plus-circle.svg';
import classes from './styles.module.css';
import { ReactSVG } from 'react-svg';
import Select from '@/components/ui/input/select';

export default function CreateRecipeModal() {
    return (
        <ActionPopupWithButton button={ <button>Create recipe</button> } popupTitle={ 'Create recipe' }>
            <RecipeForm></RecipeForm>
        </ActionPopupWithButton>
    );
}

interface Label {
    _id?: string;
    name: string;
    tool: string;
    color: string;
    isNew: boolean;
    isDeleted: boolean;
}

interface RecipeFormProps {
    id?: string;
}

function RecipeForm(props: RecipeFormProps) {
    const [name, setName] = React.useState('');
    const [{ labels }, setLabels] = React.useState<{
        labels: Map<string, Label>
    }>({
        labels: new Map([
            ['clientSideUuid', {
                _id: undefined,
                tool: 'boundingBox',
                color: '#fff',
                isDeleted: false,
                isNew: true,
                name: 'Dog'
            }]
        ])
    });

    function removeLabel(clientSideUuid: string) {
        const label = labels.get(clientSideUuid);
        if (label) {
            // Label is not saved - there's no need to persist.
            if (label.isNew) {
                labels.delete(clientSideUuid);
            }
            // Label will be deleted - there is a need to persist.
            else {
                label.isDeleted = true;
            }
            // Refresh.
            setLabels({
                labels
            });
        }
    }

    return (
        <form className={ classes.recipeForm }>
            <fieldset>
                <label>
                    <TextInput placeholder={ 'Recipe name' } icon={ link.src } label={ 'Name' } onChange={ e => {
                        setName(e.currentTarget.value);
                    } } value={ name }></TextInput>
                </label>
            </fieldset>
            <fieldset>
                <div className={ classes.labelFieldset }>
                    <legend className={ classes.recipeLabelHeader }>
                        <div className={ classes.recipeLabelDesc }>
                            <ReactSVG src={ pen.src }/>
                            <span>Labels</span>
                        </div>
                        <button className={ classes.addLabelButton } type={ 'button' }>
                            <ReactSVG src={ add.src }/>
                        </button>
                    </legend>
                    <ul>
                        {Array.from(labels.entries()).map(function transformEntry([clientSideUuid, label]) {
                            return (
                                <Label { ...label } key={ clientSideUuid } onDelete={ () => {
                                    removeLabel(clientSideUuid);
                                } }></Label>
                            );
                        })}
                    </ul>
                </div>
            </fieldset>
        </form>
    );
}

function Label(props: Label & {
    onDelete: () => void,
}) {
    if (props.isDeleted) {
        return <></>;
    }

    return (
        <li className={ classes.labelDataField }>
            <input type={ 'color' }/>
            <TextInput placeholder={ 'Label name' } classNames={ {
                input: classes.labelInput,
                container: classes.labelContainer
            } }/>
            <Select options={ [{
                value: 'boundingBox', label: 'Bounding box',
            }, {
                value: 'polygon', label: 'Polygon',
            }, {
                value: 'ellipse', label: 'Ellipse',
            }, {
                value: 'line', label: 'Line',
            }] } className={ classes.labelToolSelectContainer }/>

        </li>
    );
}
