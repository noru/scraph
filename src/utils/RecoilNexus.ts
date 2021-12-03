import {
  RecoilValue,
  RecoilState,
  useRecoilCallback,
  useRecoilTransaction_UNSTABLE,
  TransactionInterface_UNSTABLE,
} from 'recoil'

export type TransactionExecutor = (arg: TransactionInterface_UNSTABLE) => void
export type RecoilGetter = <T>(atom: RecoilValue<T>) => T
export type RecoilSetter = <T>(atom: RecoilState<T>, valOrUpdater: T | ((currVal: T) => T)) => void
export type RecoilResetter = <T>(atom: RecoilState<T>) => void
interface Nexus {
  get: <T>(atom: RecoilValue<T>) => T
  getPromise: <T>(atom: RecoilValue<T>) => Promise<T>
  set: RecoilSetter
  reset: RecoilResetter
  transaction: (executor: TransactionExecutor) => void
}

const nexus: Nexus = {} as any

export default function RecoilNexus() {

  nexus.get = useRecoilCallback(({ snapshot }) =>
    function <T>(atom: RecoilValue<T>) {
      return snapshot.getLoadable(atom).contents
    }, [])

  nexus.getPromise = useRecoilCallback(({ snapshot }) =>
    function <T>(atom: RecoilValue<T>) {
      return snapshot.getPromise(atom)
    }, [])

  nexus.set = useRecoilCallback(({ set }) => set, [])

  nexus.reset = useRecoilCallback(({ reset }) => reset, [])

  nexus.transaction = useRecoilTransaction_UNSTABLE((trans) => (transFunc) => transFunc(trans), [])

  return null
}

export function getRecoil<T>(atom: RecoilValue<T>): T {
  return nexus.get(atom)
}

export function getRecoilPromise<T>(atom: RecoilValue<T>): Promise<T> {
  return nexus.getPromise(atom)
}

export function setRecoil<T>(atom: RecoilState<T>, valOrUpdater: T | ((currVal: T) => T)) {
  nexus.set(atom, valOrUpdater)
}

export function resetRecoil<T>(atom: RecoilState<T>) {
  nexus.reset(atom)
}

export function recoilTransaction(executor: TransactionExecutor) {
  nexus.transaction(executor)
}
