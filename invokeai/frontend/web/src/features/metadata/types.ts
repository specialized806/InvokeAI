import type { ControlNetConfig, IPAdapterConfig, T2IAdapterConfig } from 'features/controlLayers/store/types';
import type { SetNonNullable } from 'type-fest';

/**
 * Renders a value of type T as a React node.
 */
export type MetadataRenderValueFunc<T> = (value: T) => Promise<string>;

/**
 * Gets the label of the current metadata item as a string.
 */
export type MetadataGetLabelFunc = () => string;

/**
 * A function that recalls a parsed and validated metadata value.
 *
 * @param value The value to recall.
 */
export type MetadataRecallFunc<T> = (value: T) => void;

/**
 * An async function that receives metadata and returns a parsed value, throwing if the value is invalid or missing.
 *
 * The function receives an object of unknown type. It is responsible for extracting the relevant data from the metadata
 * and returning a value of type T.
 *
 * The function should throw a MetadataParseError if the metadata is invalid or missing.
 *
 * @param metadata The metadata to parse.
 * @returns A promise that resolves to the parsed value.
 * @throws MetadataParseError if the metadata is invalid or missing.
 */
export type MetadataParseFunc<T = unknown> = (metadata: unknown) => Promise<T>;

/**
 * A function that performs additional validation logic before recalling a metadata value. It is called with a parsed
 * value and should throw if the validation logic fails.
 *
 * This function is used in cases where some additional logic is required before recalling. For example, when recalling
 * a LoRA, we need to check if it is compatible with the current base model.
 *
 * @param value The value to validate.
 * @returns A promise that resolves to the validated value.
 * @throws MetadataParseError if the value is invalid.
 */
export type MetadataValidateFunc<T> = (value: T) => Promise<T>;

/**
 * A function that determines whether a metadata item should be visible.
 *
 * @param value The value to check.
 * @returns True if the item should be visible, false otherwise.
 */
type MetadataGetIsVisibleFunc<T> = (value: T) => boolean;

export type MetadataHandlers<TValue = unknown, TItem = unknown> = {
  /**
   * Gets the label of the current metadata item as a string.
   *
   * @returns The label of the current metadata item.
   */
  getLabel: MetadataGetLabelFunc;
  /**
   * An async function that receives metadata and returns a parsed metadata value.
   *
   * @param metadata The metadata to parse.
   * @param withToast Whether to show a toast on success or failure.
   * @returns A promise that resolves to the parsed value.
   * @throws MetadataParseError if the metadata is invalid or missing.
   */
  parse: (metadata: unknown, withToast?: boolean) => Promise<TValue>;
  /**
   * An async function that receives a metadata item and returns a parsed metadata item value.
   *
   * This is only provided if the metadata value is an array.
   *
   * @param item The item to parse. It should be an item from the array.
   * @param withToast Whether to show a toast on success or failure.
   * @returns A promise that resolves to the parsed value.
   * @throws MetadataParseError if the metadata is invalid or missing.
   */
  parseItem?: (item: unknown, withToast?: boolean) => Promise<TItem>;
  /**
   * An async function that recalls a parsed metadata value.
   *
   * This function is only provided if the metadata value can be recalled.
   *
   * @param value The value to recall.
   * @param withToast Whether to show a toast on success or failure.
   * @returns A promise that resolves when the recall operation is complete.
   */
  recall?: (value: TValue, withToast?: boolean) => Promise<void>;
  /**
   * An async function that recalls a parsed metadata item value.
   *
   * This function is only provided if the metadata value is an array and the items can be recalled.
   *
   * @param item The item to recall. It should be an item from the array.
   * @param withToast Whether to show a toast on success or failure.
   * @returns A promise that resolves when the recall operation is complete.
   */
  recallItem?: (item: TItem, withToast?: boolean) => Promise<void>;
  /**
   * Renders a parsed metadata value as a React node.
   *
   * @param value The value to render.
   * @returns The rendered value.
   */
  renderValue: MetadataRenderValueFunc<TValue>;
  /**
   * Renders a parsed metadata item value as a React node.
   *
   * @param item The item to render.
   * @returns The rendered item.
   */
  renderItemValue?: MetadataRenderValueFunc<TItem>;
  /**
   * Checks if a parsed metadata value should be visible.
   * If not provided, the item is always visible.
   *
   * @param value The value to check.
   * @returns True if the item should be visible, false otherwise.
   */
  getIsVisible?: MetadataGetIsVisibleFunc<TValue>;
};

// TODO(psyche): The types for item handlers should be able to be inferred from the type of the value:
// type MetadataHandlersInferItem<TValue> = TValue extends Array<infer TItem> ? MetadataParseFunc<TItem> : never
// While this works for the types as expected, I couldn't satisfy TS in the implementations of the handlers.

type BuildMetadataHandlersArg<TValue, TItem> = {
  parser: MetadataParseFunc<TValue>;
  itemParser?: MetadataParseFunc<TItem>;
  recaller?: MetadataRecallFunc<TValue>;
  itemRecaller?: MetadataRecallFunc<TItem>;
  validator?: MetadataValidateFunc<TValue>;
  itemValidator?: MetadataValidateFunc<TItem>;
  getLabel: MetadataGetLabelFunc;
  renderValue?: MetadataRenderValueFunc<TValue>;
  renderItemValue?: MetadataRenderValueFunc<TItem>;
  getIsVisible?: MetadataGetIsVisibleFunc<TValue>;
};

export type BuildMetadataHandlers = <TValue, TItem>(
  arg: BuildMetadataHandlersArg<TValue, TItem>
) => MetadataHandlers<TValue, TItem>;

export type ControlNetConfigMetadata = SetNonNullable<ControlNetConfig, 'model'>;
export type T2IAdapterConfigMetadata = SetNonNullable<T2IAdapterConfig, 'model'>;
export type IPAdapterConfigMetadata = SetNonNullable<IPAdapterConfig, 'model'>;
